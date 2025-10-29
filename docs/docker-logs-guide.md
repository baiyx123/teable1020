# Teable Docker 日志查看指南

## 目录
- [基本日志查看](#基本日志查看)
- [错误日志查看](#错误日志查看)
- [实时监控](#实时监控)
- [日志级别说明](#日志级别说明)
- [日志过滤与搜索](#日志过滤与搜索)
- [日志导出](#日志导出)
- [常见问题排查](#常见问题排查)

---

## 基本日志查看

### 查看最近的日志

```bash
# 查看最近 50 条日志
docker logs standalone-teable-1 --tail 50

# 查看最近 100 条日志
docker logs standalone-teable-1 --tail 100

# 查看最近 500 条日志
docker logs standalone-teable-1 --tail 500
```

### 查看所有日志

```bash
# 查看容器的所有日志（可能很长）
docker logs standalone-teable-1
```

---

## 错误日志查看

### 查看最近的错误日志

```bash
# 查看最近 20 条错误日志
docker logs standalone-teable-1 --tail 1000 | grep -E '"level":(50|60)' | tail -20

# 查看最近 50 条错误日志
docker logs standalone-teable-1 --tail 2000 | grep -E '"level":(50|60)' | tail -50

# 查看所有错误日志
docker logs standalone-teable-1 2>&1 | grep -E '"level":(50|60)'
```

### 格式化错误日志（更易读）

```bash
# 格式化显示错误日志
docker logs standalone-teable-1 2>&1 | grep -E '"level":(50|60)' | python3 -m json.tool
```

---

## 实时监控

### 实时查看所有日志

```bash
# 实时监控容器日志（按 Ctrl+C 停止）
docker logs -f standalone-teable-1

# 实时监控并显示时间戳
docker logs -f -t standalone-teable-1
```

### 实时监控错误日志

```bash
# 只实时显示错误级别的日志
docker logs -f standalone-teable-1 2>&1 | grep --line-buffered -E '"level":(50|60)'

# 实时显示错误和警告日志
docker logs -f standalone-teable-1 2>&1 | grep --line-buffered -E '"level":(40|50|60)'
```

---

## 日志级别说明

Teable 使用 **Pino** 日志框架，日志级别如下：

| 级别 | 数值 | 说明 | 重要性 |
|------|------|------|--------|
| trace | 10 | 追踪日志 | 开发调试用 |
| debug | 20 | 调试日志 | 开发调试用 |
| info | 30 | 信息日志 | ⭐ 正常运行信息 |
| warn | 40 | 警告日志 | ⚠️ 需要注意 |
| error | 50 | 错误日志 | ❌ 需要处理 |
| fatal | 60 | 致命错误 | 🔥 紧急处理 |

### 按级别过滤日志

```bash
# 只看 INFO 级别
docker logs standalone-teable-1 | grep '"level":30'

# 只看 WARN 级别
docker logs standalone-teable-1 | grep '"level":40'

# 只看 ERROR 级别
docker logs standalone-teable-1 | grep '"level":50'

# 只看 FATAL 级别
docker logs standalone-teable-1 | grep '"level":60'

# 看 WARN 及以上（WARN + ERROR + FATAL）
docker logs standalone-teable-1 | grep -E '"level":(40|50|60)'
```

---

## 日志过滤与搜索

### 按时间过滤

```bash
# 查看从某个时间点之后的日志
docker logs standalone-teable-1 --since "2024-10-27T12:00:00"

# 查看最近 1 小时的日志
docker logs standalone-teable-1 --since 1h

# 查看最近 30 分钟的日志
docker logs standalone-teable-1 --since 30m

# 查看某个时间段的日志
docker logs standalone-teable-1 --since "2024-10-27T12:00:00" --until "2024-10-27T13:00:00"
```

### 按关键词搜索

```bash
# 搜索包含 "error" 的日志（不区分大小写）
docker logs standalone-teable-1 | grep -i "error"

# 搜索包含 "database" 的日志
docker logs standalone-teable-1 | grep -i "database"

# 搜索包含 "api" 的日志
docker logs standalone-teable-1 | grep -i "api"

# 搜索特定用户的请求日志
docker logs standalone-teable-1 | grep "user_id"

# 搜索特定 API 路由
docker logs standalone-teable-1 | grep "/api/table"

# 排除某些关键词（比如排除正常的请求日志）
docker logs standalone-teable-1 | grep -v "request completed"
```

### 按上下文查看

```bash
# 搜索关键词并显示前后 3 行
docker logs standalone-teable-1 | grep -C 3 "error"

# 搜索关键词并显示后 5 行
docker logs standalone-teable-1 | grep -A 5 "error"

# 搜索关键词并显示前 5 行
docker logs standalone-teable-1 | grep -B 5 "error"
```

---

## 日志导出

### 导出到文件

```bash
# 导出所有日志到文件
docker logs standalone-teable-1 > teable-logs.txt

# 导出最近 1000 条日志
docker logs standalone-teable-1 --tail 1000 > teable-logs-recent.txt

# 导出所有错误日志
docker logs standalone-teable-1 2>&1 | grep -E '"level":(50|60)' > teable-errors.txt

# 导出带时间戳的日志
docker logs -t standalone-teable-1 > teable-logs-with-timestamp.txt

# 导出某个时间段的日志
docker logs standalone-teable-1 --since "2024-10-27T00:00:00" --until "2024-10-27T23:59:59" > teable-logs-2024-10-27.txt
```

### 格式化导出

```bash
# 导出格式化的 JSON 日志（每条日志更易读）
docker logs standalone-teable-1 --tail 100 | while read line; do echo "$line" | python3 -m json.tool 2>/dev/null || echo "$line"; done > teable-logs-formatted.txt
```

---

## 常见问题排查

### 1. 查看容器启动日志

```bash
# 查看容器首次启动的日志
docker logs standalone-teable-1 | head -50
```

### 2. 查看数据库相关日志

```bash
# 查看数据库连接和查询日志
docker logs standalone-teable-1 | grep -i "database\|prisma\|postgres"

# 查看数据库错误
docker logs standalone-teable-1 | grep -E '"level":(50|60)' | grep -i "database"
```

### 3. 查看 API 请求日志

```bash
# 查看所有 API 请求
docker logs standalone-teable-1 | grep "request completed"

# 查看失败的 API 请求（状态码 >= 400）
docker logs standalone-teable-1 | grep "request completed" | grep -E '"statusCode":[4-5][0-9]{2}'

# 查看慢请求（响应时间 > 1000ms）
docker logs standalone-teable-1 | grep "request completed" | grep -E '"responseTime":[1-9][0-9]{3,}'
```

### 4. 查看用户认证日志

```bash
# 查看认证相关日志
docker logs standalone-teable-1 | grep -i "auth\|login\|session"

# 查看特定用户的日志
docker logs standalone-teable-1 | grep "user_id.*usrXXXXXXXXX"
```

### 5. 查看 WebSocket 连接日志

```bash
# 查看 WebSocket 相关日志
docker logs standalone-teable-1 | grep -i "ws:\|websocket\|socket"
```

### 6. 查看导入/导出日志

```bash
# 查看 CSV 导入日志
docker logs standalone-teable-1 | grep -i "import.*csv"

# 查看导入错误
docker logs standalone-teable-1 | grep -E '"level":(50|60)' | grep -i "import"
```

---

## 其他容器日志

Teable 服务由多个容器组成，其他容器的日志查看方法相同：

### 查看数据库容器日志

```bash
# 查看 PostgreSQL 日志
docker logs standalone-teable-db-1 --tail 100

# 实时监控数据库日志
docker logs -f standalone-teable-db-1
```

### 查看 Redis 缓存日志

```bash
# 查看 Redis 日志
docker logs standalone-teable-cache-1 --tail 100

# 实时监控 Redis 日志
docker logs -f standalone-teable-cache-1
```

### 查看所有容器日志

```bash
# 列出所有 teable 相关容器
docker ps | grep teable

# 查看所有容器的最近日志
docker logs standalone-teable-1 --tail 20 && echo "---" && \
docker logs standalone-teable-db-1 --tail 20 && echo "---" && \
docker logs standalone-teable-cache-1 --tail 20
```

---

## 日志分析工具

### 使用 jq 工具分析 JSON 日志

如果系统安装了 `jq`，可以更强大地分析日志：

```bash
# 安装 jq（Ubuntu/Debian）
sudo apt-get install jq

# 提取所有错误消息
docker logs standalone-teable-1 2>&1 | jq -r 'select(.level >= 50) | .msg'

# 统计各个日志级别的数量
docker logs standalone-teable-1 2>&1 | jq -r '.level' | sort | uniq -c

# 提取所有 API 路由
docker logs standalone-teable-1 2>&1 | jq -r 'select(.route) | .route' | sort | uniq

# 分析响应时间最慢的请求
docker logs standalone-teable-1 2>&1 | jq -r 'select(.responseTime) | "\(.responseTime)ms - \(.route)"' | sort -rn | head -20
```

---

## 快速参考

```bash
# 最常用的命令
docker logs -f standalone-teable-1                                    # 实时查看所有日志
docker logs standalone-teable-1 --tail 100                           # 查看最近 100 条
docker logs -f standalone-teable-1 | grep --line-buffered -E '"level":(50|60)'  # 实时查看错误
docker logs standalone-teable-1 > logs.txt                           # 导出日志

# 快速排查错误
docker logs standalone-teable-1 --tail 2000 | grep -E '"level":(50|60)' | tail -50
```

---

## 注意事项

1. **日志大小**：Docker 日志会持续增长，建议定期清理或配置日志轮转
2. **性能影响**：频繁查询大量日志可能影响系统性能
3. **敏感信息**：日志中可能包含敏感信息，导出时注意安全
4. **时区问题**：日志时间戳使用 Unix 时间戳（毫秒），需要转换

---

## 相关文档

- [Docker 日志官方文档](https://docs.docker.com/engine/reference/commandline/logs/)
- [Pino 日志框架文档](https://getpino.io/)
- [jq 工具文档](https://stedolan.github.io/jq/)

---

**最后更新**: 2024-10-27



