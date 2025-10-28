# Teable 文档

这里包含了 Teable 项目的各种文档和指南。

## 📚 文档列表

### 运维相关

- **[Docker 日志查看指南](./docker-logs-guide.md)** 📋
  - 完整的 Docker 日志查看教程
  - 包含日志级别说明、过滤方法、问题排查等
  - 适合详细学习和深入了解

- **[Docker 日志速查表](./docker-logs-cheatsheet.md)** ⚡
  - 常用命令快速参考
  - 一页纸快速查找
  - 适合日常使用

## 🚀 快速开始

如果你是第一次查看日志，推荐按以下顺序学习：

1. 先看 **[速查表](./docker-logs-cheatsheet.md)** 了解基本命令
2. 遇到问题时查阅 **[完整指南](./docker-logs-guide.md)** 获取详细信息
3. 可以设置命令别名，提高日常效率

## 💡 常用命令

```bash
# 查看最近的日志
docker logs standalone-teable-1 --tail 100

# 实时监控日志
docker logs -f standalone-teable-1

# 查看错误日志
docker logs standalone-teable-1 | grep -E '"level":(50|60)'
```

## 🔗 相关链接

- [Teable 官网](https://teable.io/)
- [Teable GitHub](https://github.com/teableio/teable)
- [Docker 官方文档](https://docs.docker.com/)

---

有问题或建议？欢迎反馈！


