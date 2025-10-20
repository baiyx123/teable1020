# 📘 Teable 技术架构文档 - 总索引

欢迎查阅 Teable 完整技术架构文档！本文档分为 4 个部分，全面介绍 Teable 的架构设计、核心功能和实现细节。

---

## 📚 文档目录

### [Part 1: Packages 包结构](./TEABLE_ARCHITECTURE_01_PACKAGES.md)

**内容概览**：
- 📦 8 个核心包的功能说明
- 🔗 包之间的依赖关系
- 📊 分层架构设计
- 🔄 数据流转概览

**核心包介绍**：
- `common-i18n` - 国际化（10种语言）
- `core` - 核心业务逻辑（模型、权限、公式）
- `db-main-prisma` - 数据库层（Prisma ORM）
- `eslint-config-bases` - 代码规范
- `icons` - 图标库（Lucide Icons）
- `openapi` - API 客户端（自动生成）
- `sdk` - 前端 SDK（组件、Hooks、模型）
- `ui-lib` - UI 组件库（shadcn/ui）

---

### [Part 2: 页面渲染与数据保存](./TEABLE_ARCHITECTURE_02_RENDERING.md)

**内容概览**：
- 🎨 主页面渲染流程（SSR → CSR）
- 📊 Grid 表格高性能渲染（Canvas + 虚拟化）
- 💾 数据保存的主要类
- 🔄 实时同步机制（ShareDB）
- 📡 频道设计

**关键技术**：
- Next.js SSR - 服务端渲染
- Canvas 渲染 - 10-100x 性能提升
- 虚拟化 - 支持百万级数据
- ShareDB - 实时协作
- 乐观更新 - 零延迟体验

---

### [Part 3: 权限控制系统](./TEABLE_ARCHITECTURE_03_PERMISSION.md)

**内容概览**：
- 🔐 五种角色定义
- 📋 完整权限矩阵（50+ 权限）
- 🏗️ 权限层级和继承
- ✅ 前后端权限检查
- 🎯 字段级细粒度权限
- 🚀 性能优化策略

**权限类型**：
- 角色权限（RBAC）
- 字段权限（Field-level）
- 视图权限（View-level）
- 共享权限（Share-link）
- 企业版权限矩阵

---

### [Part 4: 完整功能流程](./TEABLE_ARCHITECTURE_04_WORKFLOWS.md)

**内容概览**：
- 🎬 5 个完整的端到端场景
- 🔄 详细的数据流转
- 📊 架构优势分析
- 🎯 关键设计模式
- 📚 学习路径建议

**场景示例**：
1. 编辑单元格（1-12 步完整流程）
2. 创建新记录
3. 删除记录（带权限）
4. 字段类型转换
5. 公式字段自动计算

---

### [Part 5: 数据查询系统](./TEABLE_ARCHITECTURE_05_QUERY.md)

**内容概览**：
- 🔍 查询参数结构
- 📋 过滤系统（50+ 操作符）
- 🎯 TQL 查询语言
- 🔢 排序与分组
- 🔍 全文搜索
- 📈 聚合查询
- ⏭️ 分页系统

**核心特性**：
- Filter - JSON 或 TQL 格式
- Sort - 多字段排序
- Group - 多级分组
- Search - 全文搜索 + 索引
- Aggregation - 统计计算
- Pagination - Offset/Cursor

---

## 🎯 快速导航

### 👨‍💻 我是前端开发者

推荐阅读顺序：
1. Part 1 → SDK 包介绍
2. Part 2 → 页面渲染流程
3. Part 4 → 编辑单元格场景

**关键代码**：
- `packages/sdk/src/model/record/record.ts`
- `packages/sdk/src/components/grid/`
- `packages/sdk/src/hooks/`

### 🔧 我是后端开发者

推荐阅读顺序：
1. Part 1 → Core 和 DB 包介绍
2. Part 3 → 权限控制系统
3. Part 4 → 数据保存流程

**关键代码**：
- `apps/nestjs-backend/src/features/record/`
- `apps/nestjs-backend/src/features/calculation/`
- `apps/nestjs-backend/src/share-db/`

### 🎨 我是架构师

推荐阅读顺序：
1. Part 1 → 整体架构
2. Part 2 → 实时同步
3. Part 3 → 权限设计
4. Part 4 → 完整流程

**关注点**：
- Monorepo 设计
- 微服务拆分可能性
- 性能优化策略
- 扩展性设计

### 🐛 我在修 Bug

推荐工具：
1. Part 2 → 找到相关的类
2. Part 4 → 理解完整流程
3. 在对应文件中打断点调试

**调试技巧**：
```typescript
// 前端
console.log('Record update:', { recordId, fieldId, value });

// 后端
this.logger.debug('Updating record', { tableId, recordId, fields });
```

### 🔍 我要实现查询功能

推荐阅读顺序：
1. Part 5 → 查询系统完整介绍
2. Part 2 → 数据获取流程
3. Part 4 → 查询场景示例

**关键代码**：
- `apps/nestjs-backend/src/features/record/record.service.ts`
- `apps/nestjs-backend/src/db-provider/filter-query/`
- `packages/core/src/query/`

---

## 💡 关键概念速查

| 概念 | 说明 | 文档位置 |
|------|------|---------|
| **乐观更新** | 立即更新 UI，后台保存 | Part 2, Part 4 |
| **OT 算法** | 操作转换，解决冲突 | Part 2 |
| **虚拟化** | 只渲染可见部分 | Part 2 |
| **RBAC** | 基于角色的访问控制 | Part 3 |
| **ShareDB** | 实时协作引擎 | Part 2, Part 4 |
| **计算引擎** | 自动计算依赖字段 | Part 2, Part 4 |
| **Canvas 渲染** | 高性能表格渲染 | Part 2 |
| **依赖图** | 字段依赖关系 | Part 4 |
| **TQL** | Teable 查询语言 | Part 5 |
| **Filter** | 条件过滤系统 | Part 5 |
| **Aggregation** | 聚合查询 | Part 5 |
| **全文搜索** | 基于索引的文本搜索 | Part 5 |

---

## 📈 性能指标

```
表格性能：
- 数据量：支持 100万+ 行
- 渲染性能：60 FPS
- 加载速度：300 条/次
- 编辑延迟：< 50ms（乐观更新）
- 同步延迟：< 100ms（实时协作）

内存占用：
- 前端：约 200-500MB
- 后端：约 300-800MB
- 数据库：取决于数据量

并发支持：
- 同时在线：100+ 用户（单实例）
- 并发编辑：自动冲突解决
- 多实例：Redis Pub/Sub 同步
```

---

## 🔗 相关资源

### 官方资源
- 🏠 [官网](https://teable.ai)
- 📖 [帮助文档](https://help.teable.ai)
- 💬 [Discord 社区](https://discord.gg/uZwp7tDE5W)
- 🐙 [GitHub](https://github.com/teableio/teable)

### 技术文档
- 📘 [API 文档](https://help.teable.ai/en/api-doc/token)
- 🎯 [部署指南](https://help.teable.ai/en/deploy/docker)
- 🗺️ [产品路线图](https://app.teable.ai/share/shr04TEw1u9EOQojPmG/view)

---

## 📝 文档更新日志

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2025-10-18 | 1.0.0 | 初始版本，完整架构文档 |
| 2025-10-18 | 1.0.1 | 添加单元格保存状态功能文档 |
| 2025-10-18 | 1.1.0 | 新增 Part 5：数据查询系统文档 |

---

## 🙏 致谢

感谢 Teable 团队打造如此优秀的开源项目！

**本文档基于 Teable v1.10.0 版本分析生成**

---

**祝您运动愉快！🏃‍♂️**
**回来后，开发服务器应该已经准备好了！🚀**

