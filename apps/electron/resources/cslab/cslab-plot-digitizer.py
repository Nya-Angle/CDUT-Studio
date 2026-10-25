#!/usr/bin/env python3
"""CSLab 科学图表逆向数字化脚本。

能力：
- 颜色掩膜（HSV）分离目标曲线/散点；
- 骨架化 + 交叉点剥离 + 连通域排序（折线）；
- 轮廓矩质心（散点）；
- 线性 / log10 标定拟合，自动选择 R² 更高者。

坐标基准：完全由用户标定的刻度点锚定，不做任何自动旋转（rotationDeg 恒为 0），
提取像素与前端底图严格 1:1 对齐。

红线：依赖缺失或提取失败时输出 {ok:false,message,missing}，绝不伪造数据。
仅通过 stdout 输出 JSON，日志一律写 stderr。
"""

import argparse
import json
import math
import os
import sys

# 进程间编码治理：Windows 中文系统下默认走 CP936，与 Node 端 UTF-8 解码不一致会产生乱码。
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

import numpy as np


def emit(payload):
    json.dump(payload, sys.stdout, ensure_ascii=False)
    sys.stdout.flush()


def missing_modules(names):
    missing = []
    for name in names:
        try:
            __import__(name)
        except Exception:
            missing.append(name)
    return missing


def hex_to_hsv(color):
    import cv2

    text = color.lstrip("#")
    if len(text) != 6:
        raise ValueError("颜色必须是 #rrggbb")
    r = int(text[0:2], 16)
    g = int(text[2:4], 16)
    b = int(text[4:6], 16)
    pixel = np.uint8([[[b, g, r]]])
    hsv = cv2.cvtColor(pixel, cv2.COLOR_BGR2HSV)[0][0]
    return int(hsv[0]), int(hsv[1]), int(hsv[2])


def build_color_mask(image, color, tolerance):
    import cv2

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    if color:
        h, s, v = hex_to_hsv(color)
        lower = np.array([max(0, h - tolerance), max(40, s - 80), max(30, v - 90)], dtype=np.uint8)
        upper = np.array([min(179, h + tolerance), 255, 255], dtype=np.uint8)
        if h - tolerance < 0:
            mask1 = cv2.inRange(hsv, np.array([0, lower[1], lower[2]], dtype=np.uint8), upper)
            mask2 = cv2.inRange(
                hsv,
                np.array([180 + (h - tolerance), lower[1], lower[2]], dtype=np.uint8),
                np.array([179, 255, 255], dtype=np.uint8),
            )
            return cv2.bitwise_or(mask1, mask2)
        if h + tolerance > 179:
            mask1 = cv2.inRange(hsv, lower, np.array([179, 255, 255], dtype=np.uint8))
            mask2 = cv2.inRange(
                hsv,
                np.array([0, lower[1], lower[2]], dtype=np.uint8),
                np.array([h + tolerance - 180, 255, 255], dtype=np.uint8),
            )
            return cv2.bitwise_or(mask1, mask2)
        return cv2.inRange(hsv, lower, upper)

    # 自动：在饱和度/亮度足够的像素中找色相峰值，排除黑灰背景。
    h_channel = hsv[:, :, 0]
    s_channel = hsv[:, :, 1]
    v_channel = hsv[:, :, 2]
    valid = (s_channel > 80) & (v_channel > 50)
    if not np.any(valid):
        return np.zeros(h_channel.shape, dtype=np.uint8)
    histogram = np.bincount(h_channel[valid].ravel(), minlength=180)
    peak = int(np.argmax(histogram))
    lower = np.array([max(0, peak - tolerance), 70, 40], dtype=np.uint8)
    upper = np.array([min(179, peak + tolerance), 255, 255], dtype=np.uint8)
    return cv2.inRange(hsv, lower, upper)


def hue_distance(a, b):
    """HSV 色相环距离（0-179 环形）。"""
    diff = abs(a - b)
    return min(diff, 180 - diff)


def build_series_masks(image, colors, tolerance, series_count):
    """按显式颜色或自动聚类产出多组 (label, mask)。

    依赖红线：仅使用 cv2.kmeans（环境无 sklearn）。
    极端少像素防御：有效前景像素不足以支撑 k 簇时降级单掩码，
    避免 OpenCV C++ 层断言崩溃。
    """
    import cv2

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    if colors:
        masks = []
        for color in colors:
            mask = build_color_mask(image, color, tolerance)
            if np.any(mask > 0):
                masks.append((color, mask))
        if masks:
            return masks
        return [("auto", build_color_mask(image, "", tolerance))]

    h_channel = hsv[:, :, 0]
    s_channel = hsv[:, :, 1]
    v_channel = hsv[:, :, 2]
    valid = (s_channel > 80) & (v_channel > 50)
    ys, xs = np.nonzero(valid)
    if len(ys) == 0:
        return [("auto", np.zeros(h_channel.shape, dtype=np.uint8))]

    hues = h_channel[ys, xs].astype(np.float32)

    if series_count:
        k = max(1, min(4, int(series_count)))
    else:
        # 依据色相直方图主峰数量估簇数（峰间距 > 2*tolerance，占比 >= 8%）。
        histogram = np.bincount(hues.astype(np.int64).ravel(), minlength=180)
        threshold = max(1, int(histogram.max() * 0.08))
        peaks = [
            int(h)
            for h in range(180)
            if histogram[h] >= threshold
            and histogram[h] >= histogram[(h - 1) % 180]
            and histogram[h] >= histogram[(h + 1) % 180]
        ]
        merged_peaks = []
        for peak in peaks:
            if all(hue_distance(peak, kept) > tolerance * 2 for kept in merged_peaks):
                merged_peaks.append(peak)
        k = max(1, min(4, len(merged_peaks)))

    # 少像素防御：像素数不足以稳定支撑 k 簇时直接降级单掩码。
    if k <= 1 or len(hues) < max(80, k * 50):
        return [("auto", build_color_mask(image, "", tolerance))]

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 0.5)
    _, _labels, centers = cv2.kmeans(hues, k, None, criteria, 3, cv2.KMEANS_PP_CENTERS)
    merged_centers = []
    for center in centers.ravel().tolist():
        if all(hue_distance(center, kept) > tolerance for kept in merged_centers):
            merged_centers.append(center)

    masks = []
    for center in merged_centers:
        lower = np.array([max(0, int(center) - tolerance), 70, 40], dtype=np.uint8)
        upper = np.array([min(179, int(center) + tolerance), 255, 255], dtype=np.uint8)
        mask = cv2.inRange(hsv, lower, upper)
        if np.any(mask > 0):
            masks.append((f"hue-{int(center)}", mask))
    if len(masks) <= 1:
        return [("auto", build_color_mask(image, "", tolerance))]
    return masks


def fit_axis(ticks, preferred, coordinate="px"):
    # X 轴按 px 拟合，Y 轴按 py 拟合；两者都必须使用各自的像素方向。
    pixels = np.array([tick[coordinate] for tick in ticks], dtype=np.float64)
    values = np.array([tick["value"] for tick in ticks], dtype=np.float64)
    if pixels.size < 2:
        return None

    def r2_of(predicted):
        mean = float(np.mean(values))
        ss_res = float(np.sum((values - predicted) ** 2))
        ss_tot = float(np.sum((values - mean) ** 2))
        if ss_tot == 0:
            return 1.0 if ss_res == 0 else 0.0
        return 1.0 - ss_res / ss_tot

    # 线性
    linear = None
    denominator = float(np.sum((pixels - pixels.mean()) ** 2))
    if denominator > 0:
        slope = float(np.sum((pixels - pixels.mean()) * (values - values.mean())) / denominator)
        intercept = float(values.mean() - slope * pixels.mean())
        predicted = slope * pixels + intercept
        linear = {
            "scale": "linear",
            "slope": slope,
            "intercept": intercept,
            "r2": r2_of(predicted),
        }

    # 对数
    logarithmic = None
    if np.all(values > 0) and denominator > 0:
        logs = np.log10(values)
        slope = float(np.sum((pixels - pixels.mean()) * (logs - logs.mean())) / denominator)
        intercept = float(logs.mean() - slope * pixels.mean())
        predicted = 10 ** (slope * pixels + intercept)
        logarithmic = {
            "scale": "log",
            "slope": slope,
            "intercept": intercept,
            "r2": r2_of(predicted),
        }

    if preferred == "log":
        return logarithmic or linear
    if preferred == "linear":
        return linear or logarithmic
    if linear is None:
        return logarithmic
    if logarithmic is None:
        return linear
    return logarithmic if logarithmic["r2"] > linear["r2"] + 1e-9 else linear


def apply_axis(value, fit):
    if fit["scale"] == "log":
        return 10 ** (fit["slope"] * value + fit["intercept"])
    return fit["slope"] * value + fit["intercept"]


def order_component_points(points):
    """按 x 升序并对同列 y 取均值，得到单值曲线；非单值曲线保留原始顺序。"""
    if len(points) < 3:
        return points
    points = sorted(points, key=lambda item: (item[0], item[1]))
    columns = {}
    for x, y in points:
        columns.setdefault(int(round(x)), []).append(y)
    ordered = [(float(x), float(np.mean(ys))) for x, ys in sorted(columns.items())]
    return ordered if len(ordered) >= 3 else points


def smooth_curve(points):
    if len(points) < 6:
        return points
    try:
        from scipy.interpolate import splprep, splev

        xs = np.array([p[0] for p in points], dtype=np.float64)
        ys = np.array([p[1] for p in points], dtype=np.float64)
        # 仅对单调 x 的曲线做参数化样条，避免闭合成环。
        if np.any(np.diff(xs) < 0):
            return points
        tck, _ = splprep([xs, ys], s=len(points) * 0.5)
        sample = np.linspace(0, 1, max(len(points), 64))
        smooth_x, smooth_y = splev(sample, tck)
        return [(float(x), float(y)) for x, y in zip(smooth_x, smooth_y)]
    except Exception:
        return points


def extract_lines(mask):
    from skimage.morphology import skeletonize
    import cv2

    bool_mask = mask > 128
    if not np.any(bool_mask):
        return []
    skeleton = skeletonize(bool_mask).astype(np.uint8) * 255

    # 3x3 交叉点检测：中心 10 + 周围 1，和 > 12.5 即为交叉点。
    kernel = np.array([[1, 1, 1], [1, 10, 1], [1, 1, 1]], dtype=np.float32)
    filtered = cv2.filter2D((skeleton / 255.0).astype(np.float32), -1, kernel)
    junction = ((filtered > 12.5) & (skeleton > 0)).astype(np.uint8) * 255
    clean = cv2.bitwise_and(skeleton, cv2.bitwise_not(junction))

    count, labels, stats, _ = cv2.connectedComponentsWithStats(clean, connectivity=8)
    curves = []
    for label in range(1, count):
        area = int(stats[label, cv2.CC_STAT_AREA])
        if area < 6:
            continue
        ys, xs = np.nonzero(labels == label)
        points = [(float(x), float(y)) for x, y in zip(xs, ys)]
        ordered = order_component_points(points)
        if len(ordered) < 4:
            continue
        curves.append(smooth_curve(ordered))
    return curves


def extract_scatter(mask):
    import cv2

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    points = []
    for contour in contours:
        area = float(cv2.contourArea(contour))
        if area < 4:
            continue
        moments = cv2.moments(contour)
        if moments["m00"] == 0:
            continue
        points.append((moments["m10"] / moments["m00"], moments["m01"] / moments["m00"]))
    points.sort(key=lambda item: item[0])
    return [points] if points else []


# ===== 刻度数值读取（--mode read-tick）=====
# 零依赖实现：只用 numpy + cv2（plot profile 既有要求），不引入任何模型文件。
# R4 低置信度防御：置信度 < TICK_READ_MIN_CONFIDENCE 时 value 恒为 None，绝不猜。

TICK_CHAR_SIZE = (24, 32)  # (宽, 高)
TICK_READ_MIN_CONFIDENCE = 0.60
# 最佳与次佳候选的最小分差：低于此值说明字符本身不可辨识，整段作废。
TICK_MIN_MARGIN = 0.05
TICK_GLYPHS = "0123456789.-+e"


def _normalize_glyph(binary_img, ref_height):
    """按**行高 ref_height** 统一缩放到 TICK_CHAR_SIZE。

    关键：必须用整行统一的缩放比，而不是逐字 bbox 归一化。
    逐字归一化会把小数点拉成大色块，误判为 0 / e（实测已踩过此坑）。
    统一缩放后小数点仍远小于数字，尺寸特征得以保留。
    """
    import cv2

    target_w, target_h = TICK_CHAR_SIZE
    ys, xs = np.nonzero(binary_img)
    if len(xs) == 0 or len(ys) == 0:
        return None
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    roi = binary_img[y0:y1, x0:x1]

    canvas = np.zeros((target_h, target_w), dtype=np.uint8)
    scale = target_h / max(float(ref_height), 1.0)
    new_w = max(1, int(round(roi.shape[1] * scale)))
    new_h = max(1, int(round(roi.shape[0] * scale)))
    if new_w > target_w:
        new_w = target_w
    if new_h > target_h:
        new_h = target_h
    resized = cv2.resize(roi, (new_w, new_h), interpolation=cv2.INTER_AREA)
    _, resized = cv2.threshold(resized, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    ox = (target_w - new_w) // 2
    oy = target_h - new_h  # 底部对齐：小数点落在底部，与数字共享基线
    canvas[oy:oy + new_h, ox:ox + new_w] = resized
    return canvas


def _render_tick_templates():
    """用 cv2.putText 渲染 0-9 . - + e 的多字体二值模板（按数字高度统一缩放）。"""
    import cv2

    width, height = TICK_CHAR_SIZE
    raw_variants = {}
    ref_height = 1.0
    for glyph in TICK_GLYPHS:
        variants = []
        for font in (cv2.FONT_HERSHEY_SIMPLEX, cv2.FONT_HERSHEY_DUPLEX, cv2.FONT_HERSHEY_PLAIN):
            for thickness in (1, 2):
                canvas = np.zeros((height, width), dtype=np.uint8)
                scale = 1.0 if thickness == 1 else 1.2
                cv2.putText(canvas, glyph, (2, height - 6), font, scale, 255, thickness, cv2.LINE_AA)
                ys, _xs = np.nonzero(canvas)
                if len(ys) == 0:
                    continue
                ink_h = int(ys.max() - ys.min()) + 1
                if glyph == "0":
                    ref_height = max(ref_height, float(ink_h))
                variants.append((canvas, ink_h))
        if variants:
            raw_variants[glyph] = variants

    templates = {}
    for glyph, variants in raw_variants.items():
        normalized = []
        for canvas, _ink_h in variants:
            glyph_img = _normalize_glyph(canvas, ref_height)
            if glyph_img is not None:
                normalized.append(glyph_img)
        if normalized:
            templates[glyph] = normalized
    return templates


def _read_tick_value(image, rect):
    import cv2

    templates = _render_tick_templates()
    if not templates:
        return {"ok": True, "value": None, "confidence": 0.0, "message": "刻度模板生成失败"}

    x, y, w, h = (int(v) for v in rect)
    height, width = image.shape[:2]
    x = max(0, min(x, width - 1))
    y = max(0, min(y, height - 1))
    w = max(1, min(w, width - x))
    h = max(1, min(h, height - y))
    crop = image[y:y + h, x:x + w]
    if crop.size == 0:
        return {"ok": True, "value": None, "confidence": 0.0, "message": "刻度识别区域为空"}

    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY) if crop.ndim == 3 else crop
    # 文字通常比底色更暗：Otsu 二值化后取反，使字符为白色前景。
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(binary, connectivity=8)
    char_boxes = []
    for label in range(1, num_labels):
        area = stats[label, cv2.CC_STAT_AREA]
        cw = stats[label, cv2.CC_STAT_WIDTH]
        ch = stats[label, cv2.CC_STAT_HEIGHT]
        # 过噪点与整条基线/刻度线（宽高比异常）。
        if area < 12 or cw < 2 or ch < 4:
            continue
        if cw > 0 and ch > 0 and (cw / ch > 6 or ch / cw > 6):
            continue
        char_boxes.append(
            (
                stats[label, cv2.CC_STAT_LEFT],
                stats[label, cv2.CC_STAT_TOP],
                cw,
                ch,
                labels == label,
            )
        )

    if not char_boxes:
        return {"ok": True, "value": None, "confidence": 0.0, "message": "未切分出刻度字符"}

    char_boxes.sort(key=lambda item: item[0])

    # 整行统一缩放比：取各字符框高度的中位数作为行高，与模板侧的「数字高度」对齐。
    heights = sorted(int(box[3]) for box in char_boxes)
    ref_height = float(heights[len(heights) // 2]) if heights else 1.0

    matched = []
    for left, top, cw, ch, mask in char_boxes:
        glyph_img = np.zeros((h, w), dtype=np.uint8)
        glyph_img[mask] = 255
        normalized = _normalize_glyph(glyph_img, ref_height)
        if normalized is None:
            continue

        # 每个 glyph 取其所有字体模板中的最高分，再比较 glyph 之间的分差。
        per_glyph = {}
        for glyph, variants in templates.items():
            best = -1.0
            for variant in variants:
                result = cv2.matchTemplate(normalized, variant, cv2.TM_CCOEFF_NORMED)
                score = float(result[0][0])
                if score > best:
                    best = score
            per_glyph[glyph] = best

        ranked = sorted(per_glyph.items(), key=lambda item: item[1], reverse=True)
        if not ranked:
            continue
        best_glyph, best_score = ranked[0]
        second_score = ranked[1][1] if len(ranked) > 1 else -1.0

        # R4 歧义防御：最佳与次佳分差过小说明识别不可靠，整段作废由用户手填。
        if best_score - second_score < TICK_MIN_MARGIN:
            return {
                "ok": True,
                "value": None,
                "confidence": round(best_score, 4),
                "message": f"字符「{best_glyph}」与次优候选分差仅 {best_score - second_score:.2f}，识别存在歧义，请手动填写刻度值",
            }
        matched.append((best_glyph, best_score))

    if not matched:
        return {"ok": True, "value": None, "confidence": 0.0, "message": "刻度字符匹配失败"}

    text = "".join(glyph for glyph, _ in matched)
    confidence = float(sum(score for _, score in matched) / len(matched))

    # R4：低置信度一律不猜，value 恒为 None 由用户手填。
    if confidence < TICK_READ_MIN_CONFIDENCE:
        return {
            "ok": True,
            "value": None,
            "confidence": round(confidence, 4),
            "text": text,
            "message": f"置信度 {confidence:.2f} 低于阈值 {TICK_READ_MIN_CONFIDENCE:.2f}，请手动填写刻度值",
        }

    cleaned = text.replace(" ", "")
    try:
        value = float(cleaned)
    except ValueError:
        # 兼容 1e-5 / 1E+3 之类的科学计数法写法。
        try:
            value = float(cleaned.replace("e", "e").replace("E", "e"))
        except ValueError:
            return {
                "ok": True,
                "value": None,
                "confidence": round(confidence, 4),
                "text": text,
                "message": f"识别文本「{text}」不是合法数值，请手动填写刻度值",
            }

    return {"ok": True, "value": value, "confidence": round(confidence, 4), "text": text}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--calibration", default="", help="line/scatter 模式必填；read-tick 模式忽略")
    parser.add_argument("--mode", choices=["line", "scatter", "read-tick"], default="line")
    parser.add_argument("--rect", default="", help="read-tick 模式必填：x,y,w,h（原图像素坐标）")
    parser.add_argument("--color", default="")
    parser.add_argument("--colors", default="", help="逗号分隔的多个 #rrggbb，启用多曲线分色提取")
    parser.add_argument("--series-count", type=int, default=0, help="自动聚类的目标曲线簇数（2-4）；0 = 按色相主峰自动估计")
    parser.add_argument("--tolerance", type=int, default=28)
    args = parser.parse_args()

    # read-tick 只需要 numpy + cv2，且必须最先短路返回。
    if args.mode == "read-tick":
        missing = missing_modules(["numpy", "cv2"])
        if missing:
            emit({"ok": False, "message": "缺少刻度识别依赖：" + ", ".join(missing), "missing": missing})
            return
        import cv2

        image = cv2.imread(args.input, cv2.IMREAD_COLOR)
        if image is None:
            emit({"ok": False, "message": "无法读取刻度图像"})
            return
        try:
            rect = [int(part) for part in args.rect.split(",")]
            if len(rect) != 4:
                raise ValueError("rect 必须是 x,y,w,h 四段")
        except Exception as error:
            emit({"ok": False, "message": f"刻度识别区域无效：{error}"})
            return
        emit(_read_tick_value(image, rect))
        return

    required = ["numpy", "cv2", "skimage", "scipy"]
    missing = missing_modules(required)
    if missing:
        emit(
            {
                "ok": False,
                "message": "缺少绘图数字化依赖：" + ", ".join(missing),
                "missing": missing,
            }
        )
        return

    import cv2

    image = cv2.imread(args.input, cv2.IMREAD_COLOR)
    if image is None:
        emit({"ok": False, "message": "无法读取框选图像"})
        return

    try:
        if os.path.exists(args.calibration):
            with open(args.calibration, "r", encoding="utf-8") as handle:
                calibration = json.load(handle)
        else:
            calibration = json.loads(args.calibration)
        x_ticks = calibration["x"]["ticks"]
        y_ticks = calibration["y"]["ticks"]
        x_pref = calibration["x"].get("scale", "auto")
        y_pref = calibration["y"].get("scale", "auto")
    except Exception as error:
        emit({"ok": False, "message": f"标定参数无效：{error}"})
        return

    tolerance = max(8, args.tolerance)
    color_list = [item.strip() for item in args.colors.split(",") if item.strip()]
    if not color_list and args.color.strip():
        color_list = [args.color.strip()]
    series_masks = build_series_masks(image, color_list, tolerance, args.series_count)

    x_fit = fit_axis(x_ticks, x_pref, "px")
    y_fit = fit_axis(y_ticks, y_pref, "py")
    if not x_fit or not y_fit:
        emit({"ok": False, "message": "标定刻度不足，至少需要 X/Y 各 2 个刻度"})
        return

    series = []
    for mask_label, mask in series_masks:
        if args.mode == "line":
            raw_curves = extract_lines(mask)
            valid_curves = []
            for c_pixels in raw_curves:
                if len(c_pixels) < 6:
                    continue
                xs = [p[0] for p in c_pixels]
                ys = [p[1] for p in c_pixels]
                if (max(xs) - min(xs)) < 20 and (max(ys) - min(ys)) < 20:
                    continue
                valid_curves.append(c_pixels)
            valid_curves.sort(key=lambda pts: -len(pts))
            max_c = max(1, int(getattr(args, "series_count", 3))) if getattr(args, "series_count", None) else 3
            curves = valid_curves[:max_c] if valid_curves else (raw_curves[:1] if raw_curves else [])
        else:
            curves = extract_scatter(mask)
        for index, pixels in enumerate(curves):
            values = []
            pixel_list = []
            for px, py in pixels:
                value_x = apply_axis(px, x_fit)
                value_y = apply_axis(py, y_fit)
                if not math.isfinite(value_x) or not math.isfinite(value_y):
                    continue
                values.append([float(value_x), float(value_y)])
                pixel_list.append([float(px), float(py)])
            if len(values) < 2:
                continue
            label = mask_label
            if len(curves) > 1:
                label = f"{mask_label}-{index + 1}"
            series.append(
                {
                    "label": label,
                    "points": values,
                    "pixels": pixel_list,
                }
            )

    if not series:
        emit({"ok": False, "message": "未提取到有效曲线或散点，请调整颜色或标定后重试"})
        return

    emit(
        {
            "ok": True,
            "width": int(image.shape[1]),
            "height": int(image.shape[0]),
            "rotationDeg": 0.0,
            "axisFit": {
                "x": {"scale": x_fit["scale"], "r2": float(x_fit["r2"])},
                "y": {"scale": y_fit["scale"], "r2": float(y_fit["r2"])},
            },
            "series": series,
        }
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # 保证任何异常都以 JSON 返回，主进程不会收到半截输出。
        emit({"ok": False, "message": f"图表数字化脚本异常：{error}"})
