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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--calibration", required=True)
    parser.add_argument("--mode", choices=["line", "scatter"], default="line")
    parser.add_argument("--color", default="")
    parser.add_argument("--tolerance", type=int, default=28)
    args = parser.parse_args()

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

    mask = build_color_mask(image, args.color.strip(), max(8, args.tolerance))
    if not np.any(mask > 0):
        emit({"ok": False, "message": "未在框选区域检测到目标颜色曲线"})
        return

    x_fit = fit_axis(x_ticks, x_pref, "px")
    y_fit = fit_axis(y_ticks, y_pref, "py")
    if not x_fit or not y_fit:
        emit({"ok": False, "message": "标定刻度不足，至少需要 X/Y 各 2 个刻度"})
        return

    if args.mode == "line":
        raw_curves = extract_lines(mask)
        # 过滤短碎线与网格噪点碎片，杜绝通道数爆炸（保证预期在 1~3 条主曲线内）
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

    if not curves:
        emit({"ok": False, "message": "未提取到有效曲线或散点"})
        return

    series = []
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
        series.append(
            {
                "label": f"series-{index + 1}",
                "points": values,
                "pixels": pixel_list,
            }
        )

    if not series:
        emit({"ok": False, "message": "提取结果为空，请调整颜色或标定后重试"})
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
