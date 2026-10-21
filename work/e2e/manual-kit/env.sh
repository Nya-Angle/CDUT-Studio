# A15-S4 人工验收环境（source 本文件后再启动应用）
# 独立实例：避免与你日常使用的 CDUT Studio 抢单实例锁
export PROFER_DEV_INSTANCE="manual-s4"
export PROFER_CONFIG_DIR="/home/miku/Bot/CDUTStudio/cdut-studio-review-agent/work/e2e/manual-config"
export PROFER_USER_DATA_DIR="/tmp/cdut-manual-s4-userdata"
export DISPLAY="${DISPLAY:-:0}"
export XAUTHORITY="${XAUTHORITY:-/run/user/1000/.mutter-Xwaylandauth.XKZOX3}"
echo "A15-S4 验收环境就绪：配置目录 $PROFER_CONFIG_DIR"
