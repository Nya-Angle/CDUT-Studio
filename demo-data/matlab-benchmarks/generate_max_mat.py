import os
import h5py
import numpy as np
import scipy.io as sio

out_dir = r"c:\Users\Belie\Desktop\CDUT-Studio\demo-data\matlab-benchmarks"
os.makedirs(out_dir, exist_ok=True)

# 1. 生成理论最高复杂度的 MATLAB Level 5 文件
# 特性：
# - 50,000 行 x 4 列高频时间序列与多通道观测
# - 包含复数信号（实部 + 虚部）
# - 启用 zlib 整体压缩（do_compression=True）
# - 附加元数据变量和标量信息
level5_path = os.path.join(out_dir, "matlab_level5_max_compressed_complex.mat")

N = 50000
t = np.linspace(0, 50, N)
# 通道 1: 5Hz 正弦信号
ch1 = 2.5 * np.sin(2 * np.pi * 5 * t) + 0.1 * np.random.randn(N)
# 通道 2: 15Hz 阻尼余弦信号
ch2 = np.exp(-t / 20.0) * np.cos(2 * np.pi * 15 * t)
# 通道 3: 复数阻抗谱信号 (实部与虚部)
complex_signal = (ch1 + 1j * ch2)

# 组合成 50000 x 4 的复数双精度矩阵
# 矩阵第一列为基准 X（时间），后续列为物理测量信号
sensor_matrix = np.column_stack([t, ch1, ch2, complex_signal]).astype(np.complex128)

sio.savemat(
    level5_path,
    {
        "sensor_stream_50k": sensor_matrix,
        "sample_rate_hz": 1000.0,
        "experiment_title": "CDUT Science CSLab Benchmark 50k",
    },
    format="5",
    do_compression=True,
)
print(f"Generated Level 5 file: {level5_path} (Size: {os.path.getsize(level5_path)} bytes)")

# 2. 生成理论最高复杂度的 MATLAB v7.3 (HDF5) 文件
# 特性：
# - 严格 HDF5 标准容器 (\x89HDF\r\n\x1a\n)
# - B-Tree 层次结构与 Group 分组
# - 50,000 行 x 4 列双精度矩阵，启用 Chunked 分块存储与 Gzip 压缩
# - 附带 MATLAB_class / MATLAB_fields 格式元数据属性
v73_path = os.path.join(out_dir, "matlab_v73_max_hdf5_chunked.mat")

with h5py.File(v73_path, "w") as f:
    # 模拟 MATLAB 顶层属性
    f.attrs["MATLAB_class"] = np.bytes_("struct")
    
    # 物理数据矩阵: 50,000 x 4
    # 在 MATLAB 存储中，为了保持列主序连续，在 HDF5 中形状通常为 (4, 50000)
    # CDUT Studio 提取器能自动处理并在行数 < 列数时转置回 (50000, 4)
    data_matrix = np.column_stack([t, ch1, ch2, np.abs(complex_signal)]).astype(np.float64)
    
    # 建立分块和压缩的高性能数据集
    dataset = f.create_dataset(
        "telemetry_dataset_50k",
        data=data_matrix,
        chunks=(1000, 4),
        compression="gzip",
        compression_opts=6,
    )
    dataset.attrs["MATLAB_class"] = np.bytes_("double")
    dataset.attrs["MATLAB_empty"] = np.uint8(0)

print(f"Generated v7.3 file: {v73_path} (Size: {os.path.getsize(v73_path)} bytes)")
