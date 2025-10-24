# Teable Docker 构建状态

## ✅ 构建正在进行中

构建已成功启动并正在后台运行！

### 当前进度

- 📦 正在下载依赖包 (pnpm fetch)
- ⚡ 使用淘宝镜像加速，速度很快
- 🚀 预计总时间: 15-25 分钟

### 监控命令

```bash
# 方式1: 使用监控脚本（推荐）
./check-build.sh

# 方式2: 实时查看日志
tail -f build.log

# 方式3: 查看最后100行
tail -100 build.log

# 方式4: 搜索错误信息
grep -i error build.log

# 方式5: 查看构建进程
ps aux | grep "docker build"
```

### 构建阶段

整个构建分为4个阶段：

1. **deps** (依赖阶段) - 当前进行中 ⏳
   - 下载所有 npm 包 (~3410个)
   - 安装依赖
   - 生成 Prisma 客户端

2. **builder** (构建阶段) - 即将开始
   - 编译 TypeScript
   - 构建 Next.js 应用
   - 构建 NestJS 后端
   - 构建插件

3. **post-builder** (后处理阶段)
   - 清理不必要的文件
   - 安装生产依赖
   - 优化镜像大小

4. **runner** (运行时阶段)
   - 创建最终镜像
   - 配置入口点

### 关键进度指标

查看这些关键字了解进度：

```bash
# 依赖下载进度
tail -f build.log | grep "Progress: resolved"

# 构建阶段
tail -f build.log | grep -E "builder|post-builder|runner"

# 编译进度
tail -f build.log | grep -E "Compiled|Building|Generating"

# 最终完成
tail -f build.log | grep "Successfully tagged"
```

### 预估时间线

| 阶段 | 预计时间 | 说明 |
|------|---------|------|
| deps | 5-8 分钟 | 下载和安装依赖 |
| builder | 8-12 分钟 | 编译和构建应用 |
| post-builder | 2-3 分钟 | 清理和优化 |
| runner | 1-2 分钟 | 创建最终镜像 |
| **总计** | **15-25 分钟** | 首次构建 |

### 成功标志

构建完成后会看到：

```
Successfully tagged teable-community:latest
```

然后可以查看镜像：

```bash
docker images teable-community:latest
```

### 如果构建失败

1. 查看错误日志：
   ```bash
   tail -200 build.log | grep -A 10 -i error
   ```

2. 重新构建：
   ```bash
   ./build-optimized.sh
   ```

3. 清除缓存后构建：
   ```bash
   docker builder prune -a
   ./build-optimized.sh
   ```

### 停止构建

如果需要停止当前构建：

```bash
# 查找构建进程
ps aux | grep "docker build"

# 停止进程
pkill -f "docker build.*Dockerfile.optimized"

# 或直接
killall docker
```

### 下一步

构建完成后：

1. 修改 `dockers/examples/standalone/docker-compose.yaml`：
   ```yaml
   services:
     teable:
       image: teable-community:latest  # 使用本地构建的镜像
   ```

2. 启动服务：
   ```bash
   cd dockers/examples/standalone
   docker-compose up -d
   ```

3. 访问应用：
   - URL: http://localhost:3000
   - 默认账号请查看 `.env` 文件

---

💡 **提示**: 构建过程会使用大量 CPU 和内存，这是正常现象。

📊 **资源使用**: 可以用 `docker stats` 查看资源占用。

🔄 **第二次构建**: 使用缓存后只需 3-5 分钟！

