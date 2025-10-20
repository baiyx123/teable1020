# 📚 Teable 技术文档总览

## 生成的文档列表

### 🏗️ 架构文档系列（5 篇）

#### 📌 [总索引 - TEABLE_ARCHITECTURE_INDEX.md](./TEABLE_ARCHITECTURE_INDEX.md)
完整的文档导航和快速查找指南

---

#### 1️⃣ [Part 1: Packages 包结构](./TEABLE_ARCHITECTURE_01_PACKAGES.md)
**约 655 行 | 核心内容**：
- 📦 8 个核心包的功能说明
  - common-i18n（国际化）
  - core（业务逻辑核心）
  - db-main-prisma（数据库层）
  - eslint-config-bases（代码规范）
  - icons（图标库）
  - openapi（API 客户端）
  - sdk（前端 SDK）⭐⭐⭐
  - ui-lib（UI 组件）
- 🔗 包依赖关系图
- 📊 分层架构设计
- 🔄 数据流转概览

---

#### 2️⃣ [Part 2: 页面渲染与数据保存](./TEABLE_ARCHITECTURE_02_RENDERING.md)
**约 650 行 | 核心内容**：
- 🎨 主页面渲染流程
  - SSR（服务端渲染）
  - CSR（客户端渲染）
  - 视图渲染（Grid, Form, Kanban...）
- 📊 Grid 表格高性能渲染
  - Canvas 渲染原理
  - 虚拟化技术（支持百万级数据）
  - 双缓冲机制
- 💾 数据保存的主要类
  - 前端：Record, Field, View 模型
  - 后端：RecordService, RecordCalculateService
- 🔄 实时同步机制（ShareDB）
- 📡 频道设计和 Pub/Sub

---

#### 3️⃣ [Part 3: 权限控制系统](./TEABLE_ARCHITECTURE_03_PERMISSION.md)
**约 650 行 | 核心内容**：
- 🔐 五种角色定义
  - Owner（所有者）
  - Creator（创建者）
  - Editor（编辑者）
  - Commenter（评论者）
  - Viewer（查看者）
- 📋 完整权限矩阵（50+ 权限动作）
- 🏗️ 权限层级和继承规则
- ✅ 前后端权限检查
  - 装饰器（@Permissions）
  - Guard（PermissionsGuard）
  - Hook（useTablePermission）
- 🎯 字段级细粒度权限
- 🚀 性能优化（缓存、批量检查）

---

#### 4️⃣ [Part 4: 完整功能流程](./TEABLE_ARCHITECTURE_04_WORKFLOWS.md)
**约 799 行 | 核心内容**：
- 🎬 5 个完整的端到端场景
  1. **编辑单元格**（12 步详细流程）
  2. **创建新记录**
  3. **删除记录**（带权限检查）
  4. **字段类型转换**
  5. **公式字段自动计算**
- 📊 数据流转总览图
- 🎯 关键设计模式
  - 乐观更新
  - 操作转换（OT）
  - 事件驱动
  - 依赖注入
  - 虚拟化渲染
- 📚 技术栈总结
- 🏗️ 架构优势分析
- 📖 学习路径建议

---

#### 5️⃣ [Part 5: 数据查询系统](./TEABLE_ARCHITECTURE_05_QUERY.md) ✨ **新增**
**约 620 行 | 核心内容**：
- 🔍 查询参数结构（IGetRecordsRo）
- 📋 过滤系统（Filter）
  - 50+ 操作符
  - 复合过滤（AND/OR）
  - 日期范围、多选等特殊过滤
- 🎯 TQL 查询语言
  - ANTLR4 语法定义
  - 8 种查询示例
  - TQL 解析流程
- 🔢 排序系统（Sort）
  - 多字段排序
  - 视图默认排序
- 📊 分组系统（Group）
  - 多级分组
  - 分组点结构
- 🔍 全文搜索（Search）
  - PostgreSQL `to_tsvector`
  - 搜索索引（GIN）
  - 搜索高亮
- 📈 聚合查询（Aggregation）
  - 14 种聚合函数
  - 分组聚合
- ⏭️ 分页系统
  - Offset 分页
  - Cursor 分页
  - 虚拟化滚动
- 🚀 查询优化
  - 索引优化
  - 查询缓存
  - 字段投影
- 💡 6 个实际查询示例

---

### 🎨 功能实现文档

#### [单元格保存状态功能 - CELL_SAVE_STATUS.md](./packages/sdk/CELL_SAVE_STATUS.md)
**约 162 行 | 核心内容**：
- 功能概述：单元格级别的保存状态指示器
- 实现方案：边框颜色变化（蓝色→绿色→消失 / 红色）
- 技术栈：Zustand + CSS 动画 + Canvas 渲染
- 核心文件说明
- 测试步骤

#### [实现完成总结 - IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)
- 实现摘要
- 修改的文件列表
- 下一步建议

---

## 📊 文档统计

| 类别 | 文件数 | 总行数 | 字数（估算） |
|------|--------|--------|------------|
| **架构文档** | 6 | ~4,000 | ~80,000 |
| **功能文档** | 2 | ~200 | ~5,000 |
| **总计** | **8** | **~4,200** | **~85,000** |

---

## 🎯 快速查找

### 按主题查找

| 主题 | 相关文档 |
|------|---------|
| **包结构** | Part 1 |
| **渲染机制** | Part 2 |
| **权限系统** | Part 3 |
| **完整流程** | Part 4 |
| **查询系统** | Part 5 ⭐ |
| **实时同步** | Part 2, Part 4 |
| **性能优化** | Part 2, Part 4, Part 5 |
| **数据保存** | Part 2, Part 4 |
| **TQL 语言** | Part 5 ⭐ |

### 按角色查找

| 角色 | 推荐阅读 |
|------|---------|
| **前端开发** | Part 1(SDK), Part 2(渲染), Part 4(场景) |
| **后端开发** | Part 1(Core), Part 3(权限), Part 5(查询) ⭐ |
| **架构师** | 全部文档 |
| **产品经理** | Part 4(流程), Part 5(查询) |
| **测试工程师** | Part 3(权限), Part 4(场景) |

---

## 🔑 核心概念索引

- **乐观更新** → Part 2, Part 4
- **OT 算法** → Part 2
- **虚拟化** → Part 2
- **RBAC** → Part 3
- **ShareDB** → Part 2, Part 4
- **计算引擎** → Part 2, Part 4
- **Canvas 渲染** → Part 2
- **依赖图** → Part 4
- **TQL** → Part 5 ⭐
- **Filter** → Part 5 ⭐
- **Aggregation** → Part 5 ⭐
- **全文搜索** → Part 5 ⭐

---

## 📝 阅读建议

### 🚀 快速入门（1-2 小时）
1. Part 1（了解整体架构）
2. Part 4（看几个示例场景）
3. Part 5（了解查询功能）⭐

### 🎓 深入学习（4-6 小时）
1. Part 1（包结构）
2. Part 2（渲染 + 保存）
3. Part 3（权限）
4. Part 5（查询）⭐
5. Part 4（完整流程）

### 💪 全面掌握（8-12 小时）
- 按顺序阅读全部 5 篇架构文档
- 结合代码实践
- 查看功能实现文档

---

## 🎉 文档特点

✅ **全面详细** - 4,200+ 行，85,000+ 字  
✅ **图文并茂** - 流程图、代码示例、表格  
✅ **实战导向** - 大量真实代码和场景  
✅ **易于导航** - 多级索引、交叉引用  
✅ **持续更新** - 版本记录、更新日志  

---

## 📞 联系方式

如有疑问或建议，欢迎通过以下方式联系：
- 💬 [Discord 社区](https://discord.gg/uZwp7tDE5W)
- 🐙 [GitHub Issues](https://github.com/teableio/teable/issues)
- 🏠 [官方网站](https://teable.ai)

---

**文档版本**：v1.1.0  
**生成日期**：2025-10-18  
**基于版本**：Teable v1.10.0

**祝您学习愉快！🎉**



