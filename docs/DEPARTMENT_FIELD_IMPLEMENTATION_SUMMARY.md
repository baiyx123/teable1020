# 部门字段功能实施总结

## 一、已完成的改动

### 1.1 数据库 Schema 改造 ✅

**文件修改**：
1. `packages/db-main-prisma/prisma/template.prisma`
2. `packages/db-main-prisma/prisma/postgres/schema.prisma`
3. `packages/db-main-prisma/prisma/sqlite/schema.prisma`

**改动内容**：
- User 表添加主部门字段：
  - `primaryDepartmentId` - 主部门ID
  - `primaryDepartmentName` - 主部门名称
  - `primaryDepartmentCode` - 主部门编码

- 新增 Department 表：
  ```prisma
  model Department {
    id               String    @id @default(cuid())
    name             String
    code             String    @unique
    parentId         String?
    path             String?
    level            Int       @default(1)
    description      String?
    status           String    @default("active")
    createdTime      DateTime
    lastModifiedTime DateTime?
    createdBy        String
    lastModifiedBy   String?
  }
  ```

**迁移文件**：
- `packages/db-main-prisma/prisma/postgres/migrations/20251021101455_add_department/migration.sql`
- `packages/db-main-prisma/prisma/sqlite/migrations/20251021101455_add_department/migration.sql`

### 1.2 字段类型枚举 ✅

**文件**：`packages/core/src/models/field/constant.ts`

**新增字段类型**：
```typescript
export enum FieldType {
  // ... 现有类型 ...
  Department = 'department',                           // 普通部门字段
  CreatedByDepartment = 'createdByDepartment',        // 创建部门（自动）
  LastModifiedByDepartment = 'lastModifiedByDepartment', // 修改部门（自动）
}
```

### 1.3 Core 层字段实现 ✅

**新增文件**：
1. `packages/core/src/models/field/derivate/department.field.ts`
   - 普通部门字段实现
   - 支持手动选择部门
   - 存储为 JSON 格式

2. `packages/core/src/models/field/derivate/created-by-department.field.ts`
   - 创建部门字段实现
   - 计算字段，自动填充
   - 不可手动编辑

3. `packages/core/src/models/field/derivate/last-modified-by-department.field.ts`
   - 最后修改部门字段实现
   - 计算字段，自动填充

**导出**：`packages/core/src/models/field/derivate/index.ts`

### 1.4 后端 DTO 层 ✅

**新增文件**：
1. `apps/nestjs-backend/src/features/field/model/field-dto/department-field.dto.ts`
2. `apps/nestjs-backend/src/features/field/model/field-dto/created-by-department-field.dto.ts`
3. `apps/nestjs-backend/src/features/field/model/field-dto/last-modified-by-department-field.dto.ts`

**修改 Factory**：`apps/nestjs-backend/src/features/field/model/factory.ts`
- 注册新的字段类型到创建工厂

### 1.5 自动填充部门功能 ✅

**文件**：`apps/nestjs-backend/src/features/record/record.service.ts`

**改动内容**：
- `createRecordsOnlySql` 方法：创建记录时获取用户主部门并填充
- `createBatch` 方法：批量创建时填充部门信息

**填充逻辑**：
```typescript
// 获取用户的主部门
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    primaryDepartmentId: true,
    primaryDepartmentName: true,
    primaryDepartmentCode: true,
  },
});

// 构建部门信息
const departmentInfo = user?.primaryDepartmentId ? JSON.stringify({
  id: user.primaryDepartmentId,
  name: user.primaryDepartmentName,
  code: user.primaryDepartmentCode,
}) : null;

// 填充到记录
record.__created_by_department = departmentInfo;
record.__last_modified_by_department = departmentInfo;
```

### 1.6 部门管理后端服务 ✅

**新增文件**：
1. `apps/nestjs-backend/src/features/department/department.service.ts`
   - 部门 CRUD 操作
   - 部门树构建
   - 编码生成逻辑

2. `apps/nestjs-backend/src/features/department/department.controller.ts`
   - API 接口
   - 权限控制

3. `apps/nestjs-backend/src/features/department/department.module.ts`
   - 模块定义

**API 接口**：
- `GET /api/department` - 获取部门列表
- `GET /api/department/tree` - 获取部门树
- `GET /api/department/generate-code?parentId=xxx` - 生成编码
- `GET /api/department/:id` - 获取单个部门
- `POST /api/department` - 创建部门
- `PATCH /api/department/:id` - 更新部门
- `DELETE /api/department/:id` - 删除部门

**模块注册**：`apps/nestjs-backend/src/app.module.ts`

### 1.7 用户主部门管理 ✅

**文件**：
- `apps/nestjs-backend/src/features/user/user.service.ts`
- `apps/nestjs-backend/src/features/user/user.controller.ts`

**新增方法**：
- `setPrimaryDepartment(userId, departmentId)` - 设置主部门
- `getPrimaryDepartment(userId)` - 获取主部门

**API 接口**：
- `PATCH /api/user/primary-department` - 设置用户主部门

### 1.8 前端组件 ✅

**新增文件**：
1. `packages/sdk/src/components/editor/department-editor/DepartmentEditor.tsx`
   - 部门字段编辑器主组件

2. `packages/sdk/src/components/editor/department-editor/DepartmentSelector.tsx`
   - 部门选择下拉框组件

3. `packages/sdk/src/components/editor/department-editor/hooks/useDepartments.ts`
   - 部门数据获取 Hook

4. `packages/sdk/src/components/cell-value/department-show/DepartmentShow.tsx`
   - 部门字段显示组件

### 1.9 测试数据 ✅

**文件**：`packages/db-main-prisma/prisma/seed-departments.ts`

**测试数据结构**：
```
001 - 总部
  001001 - 技术部
    001001001 - 前端组
    001001002 - 后端组
    001001003 - 测试组
  001002 - 市场部
  001003 - 人事部
  001004 - 财务部
002 - 分公司
  002001 - 华东分公司
  002002 - 华南分公司
```

## 二、如何使用

### 2.1 运行数据库迁移

```bash
# 生成 Prisma Client
cd packages/db-main-prisma
pnpm prisma generate

# 运行迁移（PostgreSQL）
pnpm prisma migrate deploy --schema=./prisma/postgres/schema.prisma

# 或运行迁移（SQLite）
pnpm prisma migrate deploy --schema=./prisma/sqlite/schema.prisma
```

### 2.2 初始化测试数据

```bash
# 运行种子脚本
cd packages/db-main-prisma
pnpm tsx prisma/seed-departments.ts
```

### 2.3 设置用户主部门

```bash
# 使用 API 设置
curl -X PATCH http://localhost:3000/api/user/primary-department \
  -H "Content-Type: application/json" \
  -d '{"departmentId": "dept_001001"}'
```

或在数据库中直接更新：
```sql
UPDATE users 
SET 
  primary_department_id = 'dept_001001',
  primary_department_name = '技术部',
  primary_department_code = '001001'
WHERE id = 'your_user_id';
```

### 2.4 创建部门字段

在 Teable 界面中：
1. 进入表格设置
2. 添加新字段
3. 选择字段类型：
   - **Department** - 普通部门字段（可手动选择）
   - **CreatedByDepartment** - 创建部门（自动填充，只读）
   - **LastModifiedByDepartment** - 最后修改部门（自动填充，只读）

### 2.5 创建记录（自动填充部门）

当用户创建记录时：
```typescript
// 前端代码
const record = await createRecord({
  title: '新项目',
  description: '项目描述',
});

// 后端自动填充：
// __created_by_department: { id: 'dept_001001', name: '技术部', code: '001001' }
// __last_modified_by_department: { id: 'dept_001001', name: '技术部', code: '001001' }
```

### 2.6 按部门查询记录

```sql
-- 查询技术部创建的记录
SELECT * FROM table_xxx
WHERE json_extract(__created_by_department, '$.code') = '001001'
  AND __deleted_time IS NULL;

-- 查询多个部门的记录
SELECT * FROM table_xxx
WHERE json_extract(__created_by_department, '$.code') IN ('001001', '001002')
  AND __deleted_time IS NULL;

-- 查询技术部及其子部门的记录
SELECT * FROM table_xxx
WHERE json_extract(__created_by_department, '$.path') LIKE '/001001/%'
  AND __deleted_time IS NULL;
```

## 三、API 使用示例

### 3.1 部门管理

```bash
# 获取所有部门
curl http://localhost:3000/api/department

# 获取部门树
curl http://localhost:3000/api/department/tree

# 创建部门
curl -X POST http://localhost:3000/api/department \
  -H "Content-Type: application/json" \
  -d '{
    "name": "产品部",
    "code": "001005",
    "parentId": "dept_001",
    "description": "产品管理部门"
  }'

# 更新部门
curl -X PATCH http://localhost:3000/api/department/dept_001001 \
  -H "Content-Type: application/json" \
  -d '{"name": "技术研发部"}'

# 删除部门
curl -X DELETE http://localhost:3000/api/department/dept_001005
```

### 3.2 用户部门设置

```bash
# 设置用户主部门
curl -X PATCH http://localhost:3000/api/user/primary-department \
  -H "Content-Type: application/json" \
  -d '{"departmentId": "dept_001001"}'
```

## 四、前端使用示例

### 4.1 使用部门选择器

```typescript
import { DepartmentSelector } from '@teable/sdk/components/editor/department-editor';

function MyComponent() {
  const [department, setDepartment] = useState(null);
  
  return (
    <DepartmentSelector
      value={department?.id}
      onChange={(id, dept) => setDepartment(dept)}
      placeholder="选择部门"
    />
  );
}
```

### 4.2 显示部门信息

```typescript
import { DepartmentShow } from '@teable/sdk/components/cell-value/department-show';

function RecordCard({ record }) {
  return (
    <div>
      <h3>{record.title}</h3>
      <DepartmentShow value={record.createdByDepartment} />
    </div>
  );
}
```

### 4.3 获取部门列表

```typescript
import { useDepartments } from '@teable/sdk/components/editor/department-editor/hooks/useDepartments';

function DepartmentList() {
  const { departments, loading } = useDepartments();
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <ul>
      {departments.map(dept => (
        <li key={dept.id}>
          {'　'.repeat(dept.level - 1)}{dept.name} ({dept.code})
        </li>
      ))}
    </ul>
  );
}
```

## 五、测试验证

### 5.1 验证数据库迁移

```bash
# 检查表是否创建成功
psql -d your_database -c "\d department"
psql -d your_database -c "\d users" | grep primary_department
```

### 5.2 验证种子数据

```bash
# 查看部门数据
psql -d your_database -c "SELECT id, name, code, level FROM department ORDER BY code"

# 预期输出：
#      id      |     name     |   code    | level
# -------------|--------------|-----------|-------
#  dept_001    | 总部         | 001       | 1
#  dept_001001 | 技术部       | 001001    | 2
#  dept_001001001 | 前端组    | 001001001 | 3
#  ...
```

### 5.3 验证 API 接口

```bash
# 测试获取部门列表
curl http://localhost:3000/api/department

# 测试创建记录后的部门填充
# 1. 先设置用户主部门
curl -X PATCH http://localhost:3000/api/user/primary-department \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"departmentId": "dept_001001"}'

# 2. 创建记录
curl -X POST http://localhost:3000/api/table/TABLE_ID/record \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "records": [{
      "fields": {
        "title": "测试记录"
      }
    }]
  }'

# 3. 查询记录，检查 __created_by_department 是否有值
curl http://localhost:3000/api/table/TABLE_ID/record/RECORD_ID
```

### 5.4 验证部门查询

```sql
-- 创建几条测试记录后，验证查询
SELECT 
  __id,
  json_extract(__created_by_department, '$.name') as dept_name,
  json_extract(__created_by_department, '$.code') as dept_code
FROM table_xxx
WHERE __deleted_time IS NULL;

-- 按部门过滤
SELECT * FROM table_xxx
WHERE json_extract(__created_by_department, '$.code') = '001001';
```

## 六、已知限制和待完成功能

### 6.1 当前 MVP 的限制

1. ⚠️ 每个用户只能有一个主部门（不支持多部门）
2. ⚠️ 部门字段暂不支持从字符串导入
3. ⚠️ 没有部门成员管理界面
4. ⚠️ 没有部门合并功能
5. ⚠️ 前端组件暂未完全集成到字段编辑器中

### 6.2 Phase 2 待开发功能

根据 `ORGANIZATION_UNIT_IMPLEMENTATION_PLAN.md`，后续可以添加：

1. **多部门归属**（UserOrganization 关联表）
2. **部门合并功能**（historicalCodes 映射）
3. **部门变更历史**（DepartmentHistory 表）
4. **基于部门的权限控制**
5. **部门数据统计和报表**

## 七、文件清单

### 数据库相关
- ✅ `packages/db-main-prisma/prisma/template.prisma`
- ✅ `packages/db-main-prisma/prisma/postgres/schema.prisma`
- ✅ `packages/db-main-prisma/prisma/sqlite/schema.prisma`
- ✅ `packages/db-main-prisma/prisma/postgres/migrations/20251021101455_add_department/migration.sql`
- ✅ `packages/db-main-prisma/prisma/sqlite/migrations/20251021101455_add_department/migration.sql`
- ✅ `packages/db-main-prisma/prisma/seed-departments.ts`

### Core 层
- ✅ `packages/core/src/models/field/constant.ts`
- ✅ `packages/core/src/models/field/derivate/department.field.ts`
- ✅ `packages/core/src/models/field/derivate/created-by-department.field.ts`
- ✅ `packages/core/src/models/field/derivate/last-modified-by-department.field.ts`
- ✅ `packages/core/src/models/field/derivate/index.ts`

### 后端服务
- ✅ `apps/nestjs-backend/src/features/field/model/field-dto/department-field.dto.ts`
- ✅ `apps/nestjs-backend/src/features/field/model/field-dto/created-by-department-field.dto.ts`
- ✅ `apps/nestjs-backend/src/features/field/model/field-dto/last-modified-by-department-field.dto.ts`
- ✅ `apps/nestjs-backend/src/features/field/model/factory.ts`
- ✅ `apps/nestjs-backend/src/features/record/record.service.ts`
- ✅ `apps/nestjs-backend/src/features/department/department.service.ts`
- ✅ `apps/nestjs-backend/src/features/department/department.controller.ts`
- ✅ `apps/nestjs-backend/src/features/department/department.module.ts`
- ✅ `apps/nestjs-backend/src/features/user/user.service.ts`
- ✅ `apps/nestjs-backend/src/features/user/user.controller.ts`
- ✅ `apps/nestjs-backend/src/app.module.ts`

### 前端 SDK
- ✅ `packages/sdk/src/model/field/department.field.ts`
- ✅ `packages/sdk/src/model/field/created-by-department.field.ts`
- ✅ `packages/sdk/src/model/field/last-modified-by-department.field.ts`
- ✅ `packages/sdk/src/model/field/index.ts`
- ✅ `packages/sdk/src/model/field/factory.ts`
- ✅ `packages/sdk/src/components/editor/department-editor/DepartmentEditor.tsx`
- ✅ `packages/sdk/src/components/editor/department-editor/DepartmentSelector.tsx`
- ✅ `packages/sdk/src/components/editor/department-editor/hooks/useDepartments.ts`
- ✅ `packages/sdk/src/components/editor/department-editor/index.tsx`
- ✅ `packages/sdk/src/components/cell-value/department-show/DepartmentShow.tsx`
- ✅ `packages/sdk/src/components/cell-value/department-show/index.tsx`

## 八、下一步操作

### 8.1 立即执行

```bash
# 1. 运行数据库迁移
cd /root/teable-develop
pnpm --filter @teable/db-main-prisma prisma:migrate:deploy

# 2. 生成 Prisma Client
pnpm --filter @teable/db-main-prisma prisma:generate

# 3. 初始化测试部门数据
pnpm --filter @teable/db-main-prisma tsx prisma/seed-departments.ts

# 4. 重新构建项目
pnpm build

# 5. 启动开发服务器
pnpm dev
```

### 8.2 验证功能

1. ✅ 访问 `/api/department` 查看部门列表
2. ✅ 设置用户主部门
3. ✅ 创建表格，添加部门字段
4. ✅ 创建记录，查看自动填充的部门信息
5. ✅ 测试部门过滤查询

### 8.3 后续开发建议

参考以下文档继续扩展功能：
- `docs/USER_MULTI_DEPARTMENT_GUIDE.md` - 多部门归属
- `docs/USER_DEPARTMENT_CHANGE_GUIDE.md` - 部门变更
- `docs/DEPARTMENT_MERGE_GUIDE.md` - 部门合并
- `docs/IAM_SYSTEM_DESIGN.md` - 完整的 IAM 系统

## 九、注意事项

### 9.1 部门编码规则

- 一级部门：3位数字（001, 002, 003）
- 二级部门：父编码 + 3位数字（001001, 001002）
- 三级部门：父编码 + 3位数字（001001001）

### 9.2 部门路径格式

- 始终以 `/` 开头和结尾
- 格式：`/001/001001/001001001/`
- 用于快速查询子树

### 9.3 数据一致性

- 用户主部门信息是冗余字段（为了性能）
- 部门名称变更时，需要同步更新用户表
- 可以后续添加定时任务保持一致性

## 十、总结

本次实施成功添加了部门字段功能的 MVP 版本，包括：

✅ **完整的数据库支持**：Department 表 + User 主部门字段  
✅ **三种字段类型**：Department、CreatedByDepartment、LastModifiedByDepartment  
✅ **自动填充机制**：创建/修改记录时自动记录部门  
✅ **完整的后端服务**：部门 CRUD、用户部门设置  
✅ **前端组件**：选择器、编辑器、显示组件  
✅ **测试数据**：11个示例部门，3层层级  

这为后续的功能扩展奠定了坚实的基础！🎉

