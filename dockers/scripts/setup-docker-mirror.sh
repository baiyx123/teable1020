#!/bin/bash

# Docker 镜像源配置脚本
# 用于配置 Docker 镜像加速器，加快基础镜像下载速度

set -e

echo "========================================="
echo "  Docker 镜像加速器配置脚本"
echo "========================================="
echo ""

# 检查是否有 root 权限
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  此脚本需要 root 权限"
    echo "请使用: sudo $0"
    exit 1
fi

DOCKER_CONFIG_DIR="/etc/docker"
DOCKER_CONFIG_FILE="$DOCKER_CONFIG_DIR/daemon.json"

echo "Docker 配置目录: $DOCKER_CONFIG_DIR"
echo "配置文件: $DOCKER_CONFIG_FILE"
echo ""

# 备份现有配置
if [ -f "$DOCKER_CONFIG_FILE" ]; then
    BACKUP_FILE="$DOCKER_CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    echo "📋 备份现有配置到: $BACKUP_FILE"
    cp "$DOCKER_CONFIG_FILE" "$BACKUP_FILE"
    echo ""
fi

# 创建配置目录
mkdir -p "$DOCKER_CONFIG_DIR"

# 生成新配置
cat > "$DOCKER_CONFIG_FILE" << 'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://docker.m.daocloud.io",
    "https://registry.docker-cn.com",
    "https://mirror.ccs.tencentyun.com"
  ],
  "builder": {
    "gc": {
      "enabled": true,
      "defaultKeepStorage": "20GB"
    }
  },
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

echo "✓ Docker 配置文件已创建"
echo ""
echo "配置内容:"
cat "$DOCKER_CONFIG_FILE"
echo ""

# 重启 Docker 服务
echo "🔄 重启 Docker 服务..."
systemctl daemon-reload
systemctl restart docker

if [ $? -eq 0 ]; then
    echo "✓ Docker 服务重启成功"
else
    echo "✗ Docker 服务重启失败"
    exit 1
fi

echo ""
echo "========================================="
echo "  验证配置"
echo "========================================="
echo ""

# 等待 Docker 启动
sleep 2

# 验证配置
echo "📊 Docker 信息:"
docker info | grep -A 10 "Registry Mirrors" || echo "未找到镜像源信息"

echo ""
echo "========================================="
echo "  ✓ 配置完成"
echo "========================================="
echo ""
echo "镜像源列表:"
echo "  1. 中科大: https://docker.mirrors.ustc.edu.cn"
echo "  2. DaoCloud: https://docker.m.daocloud.io"
echo "  3. Docker CN: https://registry.docker-cn.com"
echo "  4. 腾讯云: https://mirror.ccs.tencentyun.com"
echo ""
echo "测试拉取速度:"
echo "  time docker pull node:20.9.0-bookworm"
echo ""
echo "如需恢复配置，使用备份文件:"
if [ -f "$BACKUP_FILE" ]; then
    echo "  sudo cp $BACKUP_FILE $DOCKER_CONFIG_FILE"
    echo "  sudo systemctl restart docker"
fi
echo ""

