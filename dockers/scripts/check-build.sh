#!/bin/bash

# 检查 Docker 构建进度的脚本

echo "========================================="
echo "  Docker 构建进度监控"
echo "========================================="
echo ""

# 检查构建进程是否还在运行
if pgrep -f "docker build.*Dockerfile.optimized" > /dev/null; then
    echo "✓ 构建进程正在运行中..."
    echo ""
    
    # 显示进程信息
    echo "进程信息:"
    ps aux | grep "docker build.*Dockerfile.optimized" | grep -v grep
    echo ""
    
    # 显示最后 50 行日志
    echo "最新日志 (最后 50 行):"
    echo "----------------------------------------"
    tail -n 50 build.log
    echo "----------------------------------------"
    echo ""
    echo "查看完整日志: tail -f build.log"
    echo "停止构建: pkill -f 'docker build.*Dockerfile.optimized'"
else
    echo "✗ 构建进程未运行"
    echo ""
    
    # 检查是否成功完成
    if tail -n 20 build.log 2>/dev/null | grep -q "Successfully tagged"; then
        echo "✅ 构建已成功完成！"
        echo ""
        echo "查看镜像:"
        docker images teable-community:latest
    elif [ -f build.log ]; then
        echo "⚠ 构建可能失败或已完成，请检查日志"
        echo ""
        echo "最后 30 行日志:"
        echo "----------------------------------------"
        tail -n 30 build.log
        echo "----------------------------------------"
    else
        echo "⚠ 找不到构建日志文件"
    fi
fi

echo ""
echo "========================================="

