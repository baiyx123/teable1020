# Teable Docker 构建优化指南

## 问题描述

在构建 Docker 镜像时遇到网络速度极慢的问题：
- apt-get 下载 Debian 包只有 6-22 KB/s
- npm/pnpm 下载包速度慢
- GitHub 资源下载超时

## 优化方案

### 1. 使用优化版 Dockerfile

已创建 `dockers/teable/Dockerfile.optimized`，主要优化：

- ✅ **Debian 镜像源**: 使用清华大学镜像 (mirrors.tuna.tsinghua.edu.cn)
- ✅ **NPM 镜像源**: 使用淘宝镜像 (registry.npmmirror.com)
- ✅ **GitHub 资源**: 使用 ghproxy 代理加速
- ✅ **GPG 密钥服务器**: 添加备用服务器提高成功率

### 2. 快速构建方法

#### 方法一：使用构建脚本（推荐）

```bash
# 给脚本添加执行权限
chmod +x build-optimized.sh

# 运行构建
./build-optimized.sh
```

#### 方法二：手动构建

```bash
# 启用 Docker BuildKit
export DOCKER_BUILDKIT=1

# 构建镜像
docker build \
  -f dockers/teable/Dockerfile.optimized \
  -t teable-community:latest \
  --build-arg BUILD_VERSION=1.0.0-local \
  .
```

### 3. 修改 docker-compose.yaml

构建完成后，修改 `dockers/examples/standalone/docker-compose.yaml`:

```yaml
services:
  teable:
    # 原来：
    # image: registry.cn-shenzhen.aliyuncs.com/teable/teable-community:latest
    
    # 改为使用本地构建的镜像：
    image: teable-community:latest
    
    # 或者直接构建：
    # build:
    #   context: ../../..
    #   dockerfile: dockers/teable/Dockerfile.optimized
```

### 4. 进一步优化建议

#### 4.1 配置 Docker 镜像加速

编辑 `/etc/docker/daemon.json`:

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com"
  ],
  "builder": {
    "gc": {
      "enabled": true,
      "defaultKeepStorage": "20GB"
    }
  }
}
```

重启 Docker:
```bash
sudo systemctl restart docker
```

#### 4.2 使用构建缓存

第二次构建时会自动使用缓存，大幅提速。如果需要清除缓存：

```bash
# 查看构建缓存
docker builder du

# 清理构建缓存
docker builder prune -a
```

#### 4.3 多阶段构建并行

如果机器配置够好，可以增加并行构建：

```bash
docker build \
  -f dockers/teable/Dockerfile.optimized \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --build-arg MAX_PARALLEL_DOWNLOADS=10 \
  -t teable-community:latest \
  .
```

### 5. 其他镜像源选择

如果清华镜像源仍然慢，可以尝试其他源：

#### Debian 镜像源：
- 阿里云: `mirrors.aliyun.com`
- 网易: `mirrors.163.com`
- 中科大: `mirrors.ustc.edu.cn`

#### NPM 镜像源：
- 淘宝: `https://registry.npmmirror.com`
- 腾讯云: `https://mirrors.cloud.tencent.com/npm/`
- 华为云: `https://repo.huaweicloud.com/repository/npm/`

修改 Dockerfile.optimized 中的对应地址即可。

### 6. 常见问题

#### Q: 构建还是很慢怎么办？
A: 可以尝试：
1. 换不同时间段构建（避开网络高峰期）
2. 使用代理或 VPN
3. 直接使用官方构建好的镜像

#### Q: 如何使用官方镜像？
A: docker-compose.yaml 中已配置：
```yaml
image: registry.cn-shenzhen.aliyuncs.com/teable/teable-community:latest
```

直接运行：
```bash
cd dockers/examples/standalone
docker-compose up -d
```

#### Q: 构建失败如何调试？
A: 使用详细输出模式：
```bash
docker build -f dockers/teable/Dockerfile.optimized --progress=plain --no-cache .
```

### 7. 预估构建时间

优化后的预估时间（8核16G服务器）：
- 首次构建：15-25 分钟
- 使用缓存：3-5 分钟

未优化的构建时间可能超过 1 小时。

## 总结

使用优化版 Dockerfile 和国内镜像源，可以将构建速度提升 **5-10 倍**。

如有问题，请参考 Teable 官方文档或提交 Issue。

