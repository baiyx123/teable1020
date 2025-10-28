# Docker 构建和部署脚本

本目录包含用于构建和部署 Teable Docker 镜像的工具脚本。

## 📋 脚本说明

### setup-docker-mirror.sh ⭐ 优先执行
**用途**: 配置 Docker 镜像加速器

**重要性**: ⭐⭐⭐⭐⭐ 必须首先配置！

**功能**:
- 自动配置 Docker 镜像加速器
- 使用国内镜像源（中科大、DaoCloud、腾讯云等）
- 自动备份原有配置
- 重启 Docker 服务

**使用方法**:
```bash
sudo ./dockers/scripts/setup-docker-mirror.sh
```

**效果**:
- 基础镜像下载速度提升 10-30 倍
- node:20.9.0 下载从 10-30 分钟降到 1-3 分钟

---

### build-optimized.sh
**用途**: 使用优化的 Dockerfile 构建镜像

**特性**:
- 使用国内镜像源加速
- 自动禁用代理避免冲突
- 启用 Docker BuildKit

**使用方法**:
```bash
cd /home/baiyx/teable1020
./dockers/scripts/build-optimized.sh
```

**输出**: `teable-community:latest` 镜像

---

### check-build.sh
**用途**: 检查 Docker 构建进度和状态

**功能**:
- 检查构建进程是否运行
- 显示最新构建日志
- 检查镜像是否生成成功

**使用方法**:
```bash
./dockers/scripts/check-build.sh
```

---

### monitor-build.sh
**用途**: 实时监控 Docker 构建进度

**功能**:
- 每10秒自动刷新构建状态
- 显示当前构建阶段
- 显示下载/编译进度
- 自动检测构建完成或失败

**使用方法**:
```bash
./dockers/scripts/monitor-build.sh
```

**提示**: 按 `Ctrl+C` 退出监控

---

### push-to-aliyun.sh
**用途**: 推送镜像到阿里云容器镜像服务

**前置条件**:
1. 已有阿里云账号
2. 已在阿里云容器镜像服务控制台:
   - 创建命名空间
   - 创建镜像仓库
   - 设置镜像服务密码

**使用方法**:
```bash
./dockers/scripts/push-to-aliyun.sh
```

脚本会交互式引导你完成推送过程。

---

## 🚀 完整工作流程

### 0. 配置 Docker 镜像加速器（首次必须）
```bash
sudo ./dockers/scripts/setup-docker-mirror.sh
```

**重要**：这一步必须最先执行，否则拉取基础镜像会很慢！

### 1. 构建镜像
```bash
./dockers/scripts/build-optimized.sh
```

### 2. 监控构建（可选）
```bash
# 在另一个终端窗口
./dockers/scripts/monitor-build.sh
```

### 3. 检查构建结果
```bash
./dockers/scripts/check-build.sh
```

### 4. 推送到阿里云（可选）
```bash
./dockers/scripts/push-to-aliyun.sh
```

### 5. 启动服务
```bash
cd dockers/examples/standalone
docker compose up -d
```

---

## 📝 相关文档

- `/docs/DOCKER_BUILD_GUIDE.md` - Docker 构建优化指南
- `/docs/BUILD_STATUS.md` - 构建状态监控指南
- `/dockers/teable/Dockerfile.optimized` - 优化的 Dockerfile

---

## ⚙️ 构建配置

### 优化项
- **Debian 源**: 清华大学镜像
- **NPM 源**: 淘宝镜像
- **代理**: 自动禁用（避免冲突）
- **缓存**: 启用 Docker BuildKit 缓存

### 构建时间
- **首次构建**: 15-25 分钟
- **使用缓存**: 3-5 分钟

### 镜像大小
- 约 1.75GB

---

## 🔧 故障排除

### 构建失败
```bash
# 查看详细日志
tail -100 build.log

# 清除缓存重新构建
docker builder prune -a
./dockers/scripts/build-optimized.sh
```

### 推送失败
确保：
1. 阿里云命名空间已创建
2. 镜像仓库已创建
3. 镜像服务密码已设置
4. 网络连接正常

访问: https://cr.console.aliyun.com/

