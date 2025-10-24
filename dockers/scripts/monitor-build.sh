#!/bin/bash

# 持续监控 Docker 构建进度

REFRESH_INTERVAL=10  # 刷新间隔（秒）
LOG_FILE="build.log"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}  Teable Docker 构建实时监控${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo "按 Ctrl+C 退出监控"
echo ""

# 记录开始时间
START_TIME=$(date +%s)

while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    ELAPSED_MIN=$((ELAPSED / 60))
    ELAPSED_SEC=$((ELAPSED % 60))
    
    # 清屏并显示标题
    clear
    echo -e "${BLUE}=========================================${NC}"
    echo -e "${BLUE}  Teable Docker 构建实时监控${NC}"
    echo -e "${BLUE}=========================================${NC}"
    echo -e "已运行时间: ${YELLOW}${ELAPSED_MIN}分${ELAPSED_SEC}秒${NC}"
    echo -e "刷新间隔: ${REFRESH_INTERVAL}秒 | 按 Ctrl+C 退出"
    echo ""
    
    # 检查构建进程
    if pgrep -f "docker build.*Dockerfile.optimized" > /dev/null; then
        echo -e "状态: ${GREEN}●${NC} 构建进行中..."
        echo ""
        
        # 分析当前阶段
        if tail -100 "$LOG_FILE" 2>/dev/null | grep -q "deps.*RUN"; then
            STAGE="deps (依赖安装)"
        elif tail -100 "$LOG_FILE" 2>/dev/null | grep -q "builder.*RUN"; then
            STAGE="builder (应用构建)"
        elif tail -100 "$LOG_FILE" 2>/dev/null | grep -q "post-builder.*RUN"; then
            STAGE="post-builder (后处理)"
        elif tail -100 "$LOG_FILE" 2>/dev/null | grep -q "runner.*RUN"; then
            STAGE="runner (最终打包)"
        else
            STAGE="准备中..."
        fi
        
        echo -e "当前阶段: ${BLUE}${STAGE}${NC}"
        echo ""
        
        # 显示进度信息
        if grep -q "Progress: resolved" "$LOG_FILE" 2>/dev/null; then
            LATEST_PROGRESS=$(grep "Progress: resolved" "$LOG_FILE" | tail -1)
            echo -e "下载进度: ${YELLOW}${LATEST_PROGRESS}${NC}"
        fi
        
        if grep -q "Compiled successfully" "$LOG_FILE" 2>/dev/null; then
            echo -e "编译状态: ${GREEN}✓ 部分组件编译成功${NC}"
        fi
        
        echo ""
        echo -e "${BLUE}最新日志 (最后 20 行):${NC}"
        echo "----------------------------------------"
        tail -20 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
        echo "----------------------------------------"
        
    else
        # 构建进程不在运行
        if [ -f "$LOG_FILE" ]; then
            if tail -50 "$LOG_FILE" | grep -q "Successfully tagged"; then
                echo -e "状态: ${GREEN}✓${NC} 构建成功完成！"
                echo ""
                echo -e "${GREEN}镜像已创建:${NC}"
                docker images teable-community:latest 2>/dev/null || echo "  正在刷新镜像列表..."
                echo ""
                echo -e "${BLUE}下一步:${NC}"
                echo "  1. 修改 docker-compose.yaml 使用本地镜像"
                echo "  2. 运行: cd dockers/examples/standalone && docker-compose up -d"
                echo ""
                exit 0
            else
                echo -e "状态: ${RED}✗${NC} 构建进程已停止"
                echo ""
                echo -e "${RED}可能的原因:${NC}"
                echo "  - 构建出错"
                echo "  - 手动停止"
                echo "  - 系统资源不足"
                echo ""
                echo -e "${BLUE}最后 30 行日志:${NC}"
                echo "----------------------------------------"
                tail -30 "$LOG_FILE" | sed 's/^/  /'
                echo "----------------------------------------"
                echo ""
                echo "查看完整错误: grep -i error $LOG_FILE"
                exit 1
            fi
        else
            echo -e "状态: ${YELLOW}?${NC} 未找到构建日志"
            echo ""
            echo "请先启动构建: ./build-optimized.sh"
            exit 1
        fi
    fi
    
    # 等待下次刷新
    sleep $REFRESH_INTERVAL
done

