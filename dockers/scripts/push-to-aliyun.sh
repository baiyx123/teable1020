#!/bin/bash

# 阿里云镜像推送脚本
# 
# 使用前请确保：
# 1. 已在阿里云容器镜像服务控制台创建命名空间和仓库
# 2. 已设置镜像服务密码

set -e

echo "========================================="
echo "  推送镜像到阿里云容器镜像服务"
echo "========================================="
echo ""

# 配置信息
ALIYUN_USERNAME="18521053074"
ALIYUN_REGION="cn-hangzhou"  # 可选: cn-hangzhou, cn-shanghai, cn-beijing, cn-shenzhen
ALIYUN_REGISTRY="registry.${ALIYUN_REGION}.aliyuncs.com"

# 镜像信息
LOCAL_IMAGE="teable-community:latest"
IMAGE_ID=$(docker images teable-community:latest -q)

if [ -z "$IMAGE_ID" ]; then
    echo "❌ 错误: 未找到本地镜像 ${LOCAL_IMAGE}"
    exit 1
fi

echo "本地镜像信息:"
docker images ${LOCAL_IMAGE}
echo ""

# 需要用户提供的信息
read -p "请输入阿里云命名空间（namespace，如: baiyx 或 teable）: " NAMESPACE
if [ -z "$NAMESPACE" ]; then
    echo "❌ 命名空间不能为空"
    exit 1
fi

read -p "请输入镜像仓库名称（默认: teable-community）: " REPO_NAME
REPO_NAME=${REPO_NAME:-teable-community}

read -p "请输入镜像标签（默认: latest）: " TAG
TAG=${TAG:-latest}

# 完整的远程镜像地址
REMOTE_IMAGE="${ALIYUN_REGISTRY}/${NAMESPACE}/${REPO_NAME}:${TAG}"

echo ""
echo "========================================="
echo "镜像将被推送到:"
echo "  ${REMOTE_IMAGE}"
echo "========================================="
echo ""

# 登录阿里云镜像服务
echo "步骤 1/3: 登录阿里云镜像服务..."
echo "用户名: ${ALIYUN_USERNAME}"
echo "请输入阿里云镜像服务密码（在阿里云容器镜像服务控制台设置）："
docker login --username=${ALIYUN_USERNAME} ${ALIYUN_REGISTRY}

if [ $? -ne 0 ]; then
    echo "❌ 登录失败！"
    echo ""
    echo "提示："
    echo "1. 确保已在阿里云容器镜像服务控制台设置了固定密码"
    echo "2. 访问：https://cr.console.aliyun.com/"
    echo "3. 点击【访问凭证】设置固定密码"
    exit 1
fi

echo "✓ 登录成功"
echo ""

# 打标签
echo "步骤 2/3: 给镜像打标签..."
docker tag ${LOCAL_IMAGE} ${REMOTE_IMAGE}
echo "✓ 标签创建成功: ${REMOTE_IMAGE}"
echo ""

# 推送镜像
echo "步骤 3/3: 推送镜像（镜像大小约 1.75GB，可能需要几分钟）..."
docker push ${REMOTE_IMAGE}

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "  ✅ 镜像推送成功！"
    echo "========================================="
    echo ""
    echo "镜像地址: ${REMOTE_IMAGE}"
    echo ""
    echo "使用方式："
    echo "  docker pull ${REMOTE_IMAGE}"
    echo ""
    echo "或在 docker-compose.yaml 中使用："
    echo "  image: ${REMOTE_IMAGE}"
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "可能的原因："
    echo "1. 命名空间不存在 - 需要在阿里云控制台创建"
    echo "2. 镜像仓库不存在 - 需要在阿里云控制台创建"
    echo "3. 网络问题 - 请检查网络连接"
    echo ""
    echo "阿里云容器镜像服务控制台: https://cr.console.aliyun.com/"
    exit 1
fi

