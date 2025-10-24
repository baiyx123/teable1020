#!/bin/bash

# Teable 优化构建脚本
# 使用国内镜像源加速构建

set -e

echo "========================================="
echo "  Teable 优化构建脚本"
echo "========================================="

# 检查 Docker Buildkit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "✓ 已启用 Docker BuildKit"

# 构建参数
IMAGE_NAME="teable-community"
IMAGE_TAG="latest"
BUILD_VERSION="1.0.0-local"

# 构建镜像
echo ""
echo "开始构建镜像..."
echo "镜像名称: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "构建版本: ${BUILD_VERSION}"
echo ""

docker build \
  --file dockers/teable/Dockerfile.optimized \
  --tag ${IMAGE_NAME}:${IMAGE_TAG} \
  --build-arg BUILD_VERSION=${BUILD_VERSION} \
  --build-arg NODE_VERSION=20.9.0 \
  --progress=plain \
  .

echo ""
echo "========================================="
echo "  ✓ 构建完成！"
echo "========================================="
echo ""
echo "镜像信息:"
docker images ${IMAGE_NAME}:${IMAGE_TAG}
echo ""
echo "运行方式:"
echo "  方式1: 使用 docker-compose"
echo "    修改 docker-compose.yaml 中的 image 为: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "    然后运行: docker-compose up -d"
echo ""
echo "  方式2: 直接运行容器"
echo "    docker run -d -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""

