# Teable Docker 日志速查表

## 🚀 快速开始

```bash
# 查看最近日志
docker logs standalone-teable-1 --tail 100

# 实时监控
docker logs -f standalone-teable-1

# 只看错误
docker logs standalone-teable-1 | grep -E '"level":(50|60)'
```

---

## 📊 日志级别

| 级别 | 值 | 说明 |
|------|-----|------|
| info | 30 | 正常信息 |
| warn | 40 | ⚠️ 警告 |
| error | 50 | ❌ 错误 |
| fatal | 60 | 🔥 致命 |

---

## 🔍 常用命令

### 基础查看
```bash
# 最近 N 条
docker logs standalone-teable-1 --tail 50

# 带时间戳
docker logs -t standalone-teable-1 --tail 50
```

### 实时监控
```bash
# 所有日志
docker logs -f standalone-teable-1

# 只看错误
docker logs -f standalone-teable-1 | grep --line-buffered -E '"level":(50|60)'
```

### 时间过滤
```bash
# 最近 1 小时
docker logs standalone-teable-1 --since 1h

# 最近 30 分钟
docker logs standalone-teable-1 --since 30m

# 指定时间段
docker logs standalone-teable-1 --since "2024-10-27T12:00:00" --until "2024-10-27T13:00:00"
```

### 关键词搜索
```bash
# 搜索错误
docker logs standalone-teable-1 | grep -i "error"

# 搜索 API 路由
docker logs standalone-teable-1 | grep "/api/"

# 排除正常日志
docker logs standalone-teable-1 | grep -v "request completed"
```

### 导出日志
```bash
# 全部日志
docker logs standalone-teable-1 > logs.txt

# 只导出错误
docker logs standalone-teable-1 | grep -E '"level":(50|60)' > errors.txt
```

---

## 🎯 问题排查

### 容器启动问题
```bash
docker logs standalone-teable-1 | head -50
```

### 数据库问题
```bash
docker logs standalone-teable-1 | grep -i "database\|prisma"
docker logs standalone-teable-db-1 --tail 100
```

### API 请求问题
```bash
# 失败的请求（4xx, 5xx）
docker logs standalone-teable-1 | grep "request completed" | grep -E '"statusCode":[4-5][0-9]{2}'

# 慢请求（>1秒）
docker logs standalone-teable-1 | grep "request completed" | grep -E '"responseTime":[1-9][0-9]{3,}'
```

### WebSocket 问题
```bash
docker logs standalone-teable-1 | grep -i "ws:\|websocket"
```

---

## 🐳 其他容器

```bash
# PostgreSQL
docker logs standalone-teable-db-1 --tail 100

# Redis
docker logs standalone-teable-cache-1 --tail 100

# Portainer
docker logs portainer --tail 100
```

---

## 💡 组合命令

```bash
# 最近的错误（带时间）
docker logs -t standalone-teable-1 --tail 2000 | grep -E '"level":(50|60)' | tail -20

# 实时监控错误和警告
docker logs -f standalone-teable-1 | grep --line-buffered -E '"level":(40|50|60)'

# 导出今天的错误
docker logs standalone-teable-1 --since "$(date +%Y-%m-%d)T00:00:00" | grep -E '"level":(50|60)' > errors-today.txt

# 统计错误数量
docker logs standalone-teable-1 | grep -c '"level":50'
```

---

## ⚡ 别名设置（可选）

添加到 `~/.bashrc` 或 `~/.zshrc`：

```bash
# Teable 日志别名
alias tlog='docker logs standalone-teable-1'
alias tlogf='docker logs -f standalone-teable-1'
alias tlogerr='docker logs standalone-teable-1 | grep -E "\"level\":(50|60)"'
alias tlogerrf='docker logs -f standalone-teable-1 | grep --line-buffered -E "\"level\":(50|60)"'
alias tlogrecent='docker logs standalone-teable-1 --tail 100'

# 使用方法（设置后）：
# tlog              # 查看所有日志
# tlogf             # 实时监控
# tlogerr           # 查看错误
# tlogerrf          # 实时监控错误
# tlogrecent        # 最近 100 条
```

使别名生效：
```bash
source ~/.bashrc
```

---

## 📝 使用技巧

1. **配合 less 分页查看**
   ```bash
   docker logs standalone-teable-1 | less
   ```

2. **统计日志条数**
   ```bash
   docker logs standalone-teable-1 | wc -l
   ```

3. **查找并高亮关键词**
   ```bash
   docker logs standalone-teable-1 | grep --color=always -i "error"
   ```

4. **格式化 JSON**
   ```bash
   docker logs standalone-teable-1 --tail 10 | python3 -m json.tool
   ```

---

**详细文档**: 查看 [docker-logs-guide.md](./docker-logs-guide.md)

