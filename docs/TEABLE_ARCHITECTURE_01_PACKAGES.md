# Teable 技术架构文档 - Part 1: Packages 包结构

## 📦 Packages 总览

Teable 采用 **Monorepo** 架构，使用 pnpm workspace 管理多个包。

```
packages/
├── common-i18n          (国际化)
├── core                 (核心业务逻辑)
├── db-main-prisma       (数据库层)
├── eslint-config-bases  (代码规范)
├── icons                (图标库)
├── openapi              (API 客户端)
├── sdk                  (前端 SDK)
└── ui-lib               (UI 组件库)
```

---

## 1️⃣ common-i18n - 国际化包

### 功能
- 提供多语言支持
- 统一的国际化命名空间管理

### 支持的语言
- 🇨🇳 中文 (zh)
- 🇺🇸 英文 (en)
- 🇯🇵 日语 (ja)
- 🇩🇪 德语 (de)
- 🇪🇸 西班牙语 (es)
- 🇫🇷 法语 (fr)
- 🇮🇹 意大利语 (it)
- 🇷🇺 俄语 (ru)
- 🇹🇷 土耳其语 (tr)
- 🇺🇦 乌克兰语 (uk)

### 导出内容
```typescript
export interface I18nNamespaces {
  common: typeof common;
  table: typeof table;
  sdk: typeof sdk;
  auth: typeof auth;
  space: typeof space;
  // ... 更多命名空间
}
```

### 使用场景
- 前端应用（nextjs-app）
- SDK 组件
- 后端错误消息

**许可证**：MIT

---

## 2️⃣ core - 核心业务逻辑包 ⭐

### 功能
这是 Teable 最核心的包，包含**所有业务逻辑**和**数据模型定义**。

### 主要模块

#### 📐 数据模型 (models/)
```typescript
// 字段类型
enum FieldType {
  SingleLineText = 'singleLineText',
  LongText = 'longText',
  User = 'user',
  Attachment = 'attachment',
  Checkbox = 'checkbox',
  MultipleSelect = 'multipleSelect',
  SingleSelect = 'singleSelect',
  Date = 'date',
  Number = 'number',
  Rating = 'rating',
  Formula = 'formula',      // 公式字段
  Rollup = 'rollup',        // 汇总字段
  Link = 'link',            // 关联字段
  CreatedTime = 'createdTime',
  LastModifiedTime = 'lastModifiedTime',
  CreatedBy = 'createdBy',
  LastModifiedBy = 'lastModifiedBy',
  AutoNumber = 'autoNumber',
  Button = 'button',
}

// 关系类型
enum Relationship {
  OneOne = 'oneOne',
  ManyMany = 'manyMany',
  OneMany = 'oneMany',
  ManyOne = 'manyOne',
}
```

#### 🔐 权限系统 (auth/)
```typescript
// 角色定义
enum Role {
  Owner = 'owner',      // 所有者 - 完全权限
  Creator = 'creator',  // 创建者 - 创建和编辑
  Editor = 'editor',    // 编辑者 - 编辑数据
  Commenter = 'commenter', // 评论者 - 只能评论
  Viewer = 'viewer',    // 查看者 - 只读
}

// 权限动作（示例）
type Action = 
  | 'space|create' | 'space|delete' | 'space|read' | 'space|update'
  | 'base|create' | 'base|delete' | 'base|read' | 'base|update'
  | 'table|create' | 'table|delete' | 'table|read' | 'table|update'
  | 'field|create' | 'field|delete' | 'field|read' | 'field|update'
  | 'record|create' | 'record|delete' | 'record|read' | 'record|update'
  | 'view|create' | 'view|delete' | 'view|read' | 'view|update'
  // ... 50+ 种权限动作
```

**权限检查示例**：
```typescript
// 检查用户是否有权限
checkPermissions(Role.Editor, ['record|update', 'record|create']) 
// → true

checkPermissions(Role.Viewer, ['record|update']) 
// → false
```

#### 🔨 操作构建器 (op-builder/)
用于构建 ShareDB 操作（Operational Transformation）

```typescript
// 记录操作构建器
RecordOpBuilder.editor.setRecord.build({
  fieldId: 'fldXXX',
  oldCellValue: 'old value',
  newCellValue: 'new value',
});

// 视图操作构建器
ViewOpBuilder.editor.setViewProperty.build({
  key: 'filter',
  newValue: { ... },
});

// 字段操作构建器
FieldOpBuilder.editor.setFieldProperty.build({
  key: 'options',
  newValue: { ... },
});
```

#### 📊 公式解析器 (formula/)
- 使用 ANTLR4 解析公式语法
- 支持 100+ 函数
- 类型推导和验证

```typescript
// 公式示例
"IF({Status} = 'Done', {Price} * 1.1, {Price})"
"SUM({Sales})"
"CONCATENATE({FirstName}, ' ', {LastName})"
```

#### 🔍 查询构建器 (query/)
- TQL (Teable Query Language) 解析
- SQL 查询构建
- 过滤、排序、分组

#### 🛠️ 工具函数 (utils/)
- ID 生成器
- 颜色处理
- 类型转换
- 验证工具

### 关键依赖
```json
{
  "zod": "校验和类型定义",
  "antlr4ts": "公式解析器",
  "dayjs": "日期处理",
  "lodash": "工具函数",
  "axios": "HTTP 客户端",
  "color": "颜色处理"
}
```

**许可证**：MIT
**位置**：被 backend、nextjs-app、sdk 等所有包依赖

---

## 3️⃣ db-main-prisma - 数据库层

### 功能
- 数据库 Schema 定义
- Prisma Client 生成
- 数据库迁移管理
- 种子数据

### 支持的数据库
- ✅ **PostgreSQL**（生产推荐）
- ✅ **SQLite**（开发模式）

### 目录结构
```
db-main-prisma/
├── prisma/
│   ├── postgres/
│   │   ├── schema.prisma      (PostgreSQL Schema)
│   │   └── migrations/        (82+ 迁移文件)
│   ├── sqlite/
│   │   ├── schema.prisma      (SQLite Schema)
│   │   └── migrations/        (52+ 迁移文件)
│   └── seed.ts                (种子数据)
├── src/
│   ├── prisma.module.ts       (NestJS 模块)
│   ├── prisma.service.ts      (Prisma 服务)
│   └── seeds/                 (种子数据逻辑)
```

### 核心服务
```typescript
@Injectable()
export class PrismaService extends PrismaClient {
  // 事务支持
  async $tx<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T>
  
  // 事务后钩子
  bindAfterTransaction(callback: () => Promise<void>): void
  
  // 获取事务客户端
  txClient(): Prisma.TransactionClient
}
```

### 关键特性
- ✅ 事务支持（ACID）
- ✅ 事务后钩子（用于发射事件）
- ✅ 连接池管理
- ✅ 自动迁移部署

**许可证**：MIT

---

## 4️⃣ eslint-config-bases - 代码规范包

### 功能
统一的 ESLint 配置，确保代码质量和风格一致

### 提供的配置
- `react` - React 规则
- `typescript` - TypeScript 规则
- `prettier-config` - Prettier 配置
- `sonar` - SonarJS 规则
- `tailwind` - Tailwind CSS 规则
- `jest` - Jest 测试规则
- `playwright` - E2E 测试规则
- `mdx` - MDX 文档规则

### 使用示例
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@teable/eslint-config-bases/typescript',
    '@teable/eslint-config-bases/react',
    '@teable/eslint-config-bases/tailwind',
  ],
};
```

**许可证**：MIT

---

## 5️⃣ icons - 图标库

### 功能
基于 Lucide Icons 的自定义图标组件

### 生成方式
```bash
# 从 Lucide Icons 生成 React 组件
pnpm run scripts/generate.mjs
```

### 使用示例
```tsx
import { Table2, Plus, Trash2, Edit } from '@teable/icons';

<Table2 className="size-5" />
<Plus />
```

### 特点
- ✅ Tree-shakeable（按需引入）
- ✅ TypeScript 类型支持
- ✅ 自动生成，保持最新

**许可证**：MIT

---

## 6️⃣ openapi - API 客户端包 ⭐

### 功能
自动生成的 API 客户端，提供类型安全的 HTTP 请求

### 主要 API 模块

```typescript
// 记录操作
import { 
  getRecords,      // 获取记录列表
  getRecord,       // 获取单条记录
  createRecords,   // 创建记录
  updateRecord,    // 更新记录
  updateRecords,   // 批量更新
  deleteRecords,   // 删除记录
} from '@teable/openapi';

// 字段操作
import {
  getFields,       // 获取字段列表
  createField,     // 创建字段
  updateField,     // 更新字段
  deleteField,     // 删除字段
  convertField,    // 字段类型转换
} from '@teable/openapi';

// 视图操作
import {
  getViews,        // 获取视图列表
  createView,      // 创建视图
  updateView,      // 更新视图
  deleteView,      // 删除视图
} from '@teable/openapi';

// 表格操作
import {
  getTables,       // 获取表格列表
  createTable,     // 创建表格
  updateTable,     // 更新表格
  deleteTable,     // 删除表格
} from '@teable/openapi';

// Base 操作
import {
  getBaseList,     // 获取 Base 列表
  getBaseById,     // 获取 Base 详情
  createBase,      // 创建 Base
  updateBase,      // 更新 Base
  deleteBase,      // 删除 Base
} from '@teable/openapi';

// Space 操作
import {
  getSpaceList,    // 获取空间列表
  createSpace,     // 创建空间
  updateSpace,     // 更新空间
} from '@teable/openapi';
```

### 类型定义
```typescript
// 所有 API 的 Request/Response 类型
interface IGetRecordsRo {
  viewId?: string;
  filter?: IFilter;
  orderBy?: ISort;
  groupBy?: IGroup;
  skip?: number;
  take?: number;
  fieldKeyType?: FieldKeyType;
  // ...
}

interface IRecordsVo {
  records: IRecord[];
  extra?: unknown;
}
```

### 生成方式
通过 OpenAPI Schema 自动生成，确保前后端类型一致

**许可证**：MIT

---

## 7️⃣ sdk - 前端 SDK 包 ⭐⭐⭐

### 功能
提供给前端使用的完整 SDK，包含组件、Hooks、工具等

### 主要模块

#### 📱 Components (组件)
```
sdk/src/components/
├── grid/                    # Canvas 渲染的高性能表格
│   ├── Grid.tsx            # 主表格组件
│   ├── RenderLayer.tsx     # Canvas 渲染层
│   ├── InteractionLayer.tsx # 交互层
│   ├── renderers/          # 各种渲染器
│   └── managers/           # 管理器（坐标、图片等）
├── grid-enhancements/       # 表格增强功能
│   ├── hooks/              # 表格相关 Hooks
│   ├── editor/             # 单元格编辑器
│   └── store/              # 状态管理
├── expand-record/           # 记录展开视图
├── create-record/           # 创建记录对话框
├── field-setting/           # 字段设置
├── comment/                 # 评论组件
└── editor/                  # 各种字段编辑器
```

#### 🎣 Hooks (钩子)
```typescript
// 数据 Hooks
useFields()          // 获取字段列表
useRecords()         // 获取记录列表  
useRecord()          // 获取单条记录
useViews()           // 获取视图列表
useView()            // 获取单个视图
useTable()           // 获取表格信息
useBase()            // 获取 Base 信息

// 连接 Hooks
useConnection()      // ShareDB 连接
useSession()         // 用户会话

// 权限 Hooks
useTablePermission() // 表格权限
useBasePermission()  // Base 权限
useFieldPermission() // 字段权限

// 操作 Hooks
useRecordOperations()  // 记录操作
useFieldOperations()   // 字段操作
useUndoRedo()         // 撤销/重做

// 实时同步 Hooks
useTableListener()    // 监听表格变化
useViewListener()     // 监听视图变化
usePresence()         // 在线状态
```

#### 🎨 Model (数据模型)
```typescript
// Record 模型 - 记录操作
class Record extends RecordCore {
  async updateCell(fieldId, cellValue)  // 更新单元格
  getCellValue(fieldId)                 // 获取单元格值
  // ...
}

// Field 模型 - 字段操作
class Field extends FieldCore {
  cellValue2String(value)               // 单元格值转字符串
  convertStringToCellValue(str)         // 字符串转单元格值
  validateCellValue(value)              // 验证单元格值
  // ...
}

// View 模型
class GridView extends ViewCore {
  // 网格视图逻辑
}

class FormView extends ViewCore {
  // 表单视图逻辑
}

// Table 模型
class Table extends TableCore {
  // 表格逻辑
}
```

#### 🌐 Context (上下文)
```typescript
// 数据 Providers
<RecordProvider>       // 记录数据
<FieldProvider>        // 字段数据
<ViewProvider>         // 视图数据
<TableProvider>        // 表格数据
<BaseProvider>         // Base 数据

// 权限 Providers
<TablePermissionProvider>  // 表格权限

// 连接 Providers
<ConnectionProvider>       // ShareDB 连接

// 聚合 Providers
<AggregationProvider>      // 聚合查询
<RowCountProvider>         // 行计数
```

### 核心依赖
```json
{
  "@teable/core": "核心逻辑",
  "@teable/openapi": "API 客户端",
  "@teable/ui-lib": "UI 组件",
  "@tanstack/react-query": "数据获取",
  "sharedb": "实时协作",
  "zustand": "状态管理",
  "@glideapps/glide-data-grid": "高性能表格基础"
}
```

**许可证**：MIT

---

## 8️⃣ ui-lib - UI 组件库

### 功能
基于 shadcn/ui 的 UI 组件库

### 主要组件
```
ui-lib/src/shadcn/
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   ├── popover.tsx
│   ├── select.tsx
│   ├── toast.tsx
│   ├── sonner.tsx      # Toast 通知
│   ├── dropdown-menu.tsx
│   ├── context-menu.tsx
│   └── ... 50+ 组件
└── global.shadcn.css   # 全局样式
```

### 自定义组件
```
ui-lib/src/base/
├── message.tsx         # 消息提示
├── async-message.tsx   # 异步消息
└── ...
```

### 特点
- ✅ 基于 Radix UI
- ✅ Tailwind CSS 样式
- ✅ 深色/浅色主题
- ✅ 完全可定制
- ✅ 无障碍支持

**许可证**：MIT

---

## 📊 Packages 依赖关系图

```
┌─────────────────────────────────────────────────────┐
│                   应用层                              │
├─────────────────────────────────────────────────────┤
│  apps/nextjs-app          apps/nestjs-backend       │
│       ↓                          ↓                   │
├─────────────────────────────────────────────────────┤
│                   SDK 层                             │
├─────────────────────────────────────────────────────┤
│  @teable/sdk ←─────────┐                            │
│       ↓                 │                            │
│  @teable/openapi        │                            │
│       ↓                 │                            │
├─────────────────────────────────────────────────────┤
│                  核心层                              │
├─────────────────────────────────────────────────────┤
│  @teable/core ←─────────┘                           │
│       ↓                                              │
│  @teable/db-main-prisma                             │
│       ↓                                              │
├─────────────────────────────────────────────────────┤
│                  基础层                              │
├─────────────────────────────────────────────────────┤
│  @teable/ui-lib                                     │
│  @teable/icons                                      │
│  @teable/common-i18n                                │
│  @teable/eslint-config-bases                        │
└─────────────────────────────────────────────────────┘
```

### 依赖说明

| 包 | 依赖的包 | 被依赖的包 |
|---|---------|-----------|
| **common-i18n** | 无 | nextjs-app, sdk |
| **icons** | 无 | nextjs-app, sdk, ui-lib |
| **ui-lib** | icons | nextjs-app, sdk |
| **eslint-config-bases** | 无 | 所有包 |
| **core** | 无 | backend, nextjs-app, sdk, openapi |
| **db-main-prisma** | core | backend |
| **openapi** | core | nextjs-app, sdk, backend |
| **sdk** | core, openapi, ui-lib, icons, i18n | nextjs-app |

### 分层原则

1. **基础层**：无依赖，可独立使用
2. **核心层**：业务逻辑，只依赖基础层
3. **SDK 层**：封装 API 调用和组件
4. **应用层**：具体应用实现

---

## 🔄 数据流转

```
用户操作（浏览器）
    ↓
SDK Components (React)
    ↓
SDK Model (Record.updateCell)
    ↓
OpenAPI Client (updateRecord)
    ↓
HTTP Request
    ↓
Backend Controller (RecordOpenApiController)
    ↓
Backend Service (RecordOpenApiService)
    ↓
Core Logic (Record Calculate, Validation)
    ↓
Prisma Service (Database)
    ↓
Database (PostgreSQL/SQLite)
    ↓
事务提交
    ↓
ShareDB 同步 (实时通知)
    ↓
WebSocket 推送
    ↓
所有客户端更新
```

---

**下一部分**：主页面渲染流程



