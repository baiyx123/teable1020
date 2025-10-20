# 单位（组织单元）数据过滤功能实现方案

## 一、现状分析

### 1.1 系统中已有的相关功能

根据代码库分析，系统目前具备以下基础：

1. **Organization 概念已存在但未完全实现**
   - 位置：`packages/openapi/src/organization/`
   - 包含部门（Department）的基本定义
   - 用户可以关联到 organization 和 departments

2. **Department 数据结构**
```typescript
// packages/openapi/src/organization/departments.ts
{
  id: string,
  name: string,
  parentId?: string,           // 父部门ID
  path?: string[],            // 部门路径数组
  pathName?: string[],        // 部门名称路径数组
  hasChildren: boolean
}
```

3. **用户与部门的关联**
```typescript
// packages/openapi/src/auth/user-me.ts
organization: {
  id: string,
  name: string,
  departments: Array<{
    id: string,
    name: string
  }>,
  isAdmin: boolean
}
```

4. **记录的创建者字段**
   - 每条记录都有 `__created_by` 字段（存储用户ID）
   - 对应的字段类型：`FieldType.CreatedBy`

### 1.2 缺少的功能

1. ❌ Department 表在数据库 schema 中不存在
2. ❌ User 表缺少部门关联字段
3. ❌ 部门的层级编码（如 001, 001001）未实现
4. ❌ "创建单位"字段类型不存在
5. ❌ 基于单位的数据过滤功能未实现

## 二、实现方案

### 2.1 数据库 Schema 设计

#### 2.1.1 新增 Organization 表

```prisma
// packages/db-main-prisma/prisma/template.prisma

model Organization {
  id               String    @id @default(cuid())
  name             String
  code             String    @unique    // 组织编码（唯一）
  description      String?
  logo             String?
  createdTime      DateTime  @default(now()) @map("created_time")
  deletedTime      DateTime? @map("deleted_time")
  lastModifiedTime DateTime? @updatedAt @map("last_modified_time")
  
  departments      Department[]
  users            UserOrganization[]
  
  @@map("organization")
}
```

#### 2.1.2 新增 Department 表（单位表）

```prisma
model Department {
  id               String    @id @default(cuid())
  organizationId   String    @map("organization_id")
  name             String
  code             String    // 单位编码（如: 001, 001001, 001002）
  parentId         String?   @map("parent_id")     // 父单位ID
  level            Int       // 层级（1, 2, 3...）
  path             String    // 路径编码（如: /001/001001/）用于查询
  pathName         String?   @map("path_name")     // 路径名称（如: /总部/技术部/）
  sortOrder        Int       @default(0) @map("sort_order")
  description      String?
  managerId        String?   @map("manager_id")    // 部门负责人
  createdTime      DateTime  @default(now()) @map("created_time")
  deletedTime      DateTime? @map("deleted_time")
  lastModifiedTime DateTime? @updatedAt @map("last_modified_time")
  
  organization     Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  parent           Department?  @relation("DepartmentHierarchy", fields: [parentId], references: [id])
  children         Department[] @relation("DepartmentHierarchy")
  users            UserOrganization[]
  
  @@unique([organizationId, code])
  @@index([organizationId])
  @@index([parentId])
  @@index([path])
  @@map("department")
}
```

#### 2.1.3 新增 UserOrganization 关联表

```prisma
model UserOrganization {
  id             String    @id @default(cuid())
  userId         String    @map("user_id")
  organizationId String    @map("organization_id")
  departmentId   String    @map("department_id")
  isPrimary      Boolean   @default(false) @map("is_primary")  // 是否为主部门
  isAdmin        Boolean   @default(false) @map("is_admin")    // 是否为部门管理员
  joinTime       DateTime  @default(now()) @map("join_time")
  
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  department     Department   @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  
  @@unique([userId, organizationId, departmentId])
  @@index([userId])
  @@index([departmentId])
  @@map("user_organization")
}
```

#### 2.1.4 修改 User 表

```prisma
model User {
  // ... 现有字段 ...
  
  organizations  UserOrganization[]  // 新增
  
  @@map("users")
}
```

### 2.2 新增字段类型：CreatedByDepartment

#### 2.2.1 添加到字段类型枚举

```typescript
// packages/core/src/models/field/constant.ts

export enum FieldType {
  // ... 现有类型 ...
  CreatedByDepartment = 'createdByDepartment',  // 新增：创建单位
  LastModifiedByDepartment = 'lastModifiedByDepartment',  // 新增：最后修改单位
}
```

#### 2.2.2 创建字段实现类

```typescript
// packages/core/src/models/field/derivate/created-by-department.field.ts

import { CellValueType, DbFieldType, FieldType } from '../constant';
import { FieldCore } from '../field';

export interface ICreatedByDepartmentCellValue {
  id: string;
  name: string;
  code: string;
  path: string;
}

export class CreatedByDepartmentFieldCore extends FieldCore {
  type = FieldType.CreatedByDepartment as const;
  
  cellValueType = CellValueType.String;
  
  dbFieldType = DbFieldType.Json;
  
  isComputed = true;  // 计算字段，不可手动编辑
  
  options = null;
  
  item2String(value?: unknown): string {
    if (!value) return '';
    const dept = value as ICreatedByDepartmentCellValue;
    return `${dept.name} (${dept.code})`;
  }
  
  cellValue2String(value?: unknown): string {
    return this.item2String(value);
  }
  
  convertStringToCellValue(str: string): unknown {
    return null;  // 计算字段不支持从字符串转换
  }
  
  repair(value: unknown): unknown {
    return null;  // 计算字段不支持修复
  }
  
  validateOptions() {
    return undefined;
  }
  
  validateCellValue(value: unknown) {
    return { success: true, data: value };
  }
  
  eq(value: unknown, other: unknown): boolean {
    if (!value || !other) return value === other;
    const v1 = value as ICreatedByDepartmentCellValue;
    const v2 = other as ICreatedByDepartmentCellValue;
    return v1.id === v2.id;
  }
}
```

### 2.3 记录表增加创建单位字段

在动态创建的记录表中，需要添加新的系统字段：

```typescript
// apps/nestjs-backend/src/features/table/table.service.ts

// 在创建表时添加系统字段
const systemFields = [
  '__id',
  '__created_by',
  '__created_by_department',      // 新增：创建人单位
  '__last_modified_by',
  '__last_modified_by_department', // 新增：最后修改人单位
  '__created_time',
  '__last_modified_time',
  '__auto_number',
  '__version',
];
```

字段定义：
```sql
-- __created_by_department: TEXT (存储 JSON 字符串)
-- 结构: {"id": "dept123", "name": "技术部", "code": "001001", "path": "/001/001001/"}
```

### 2.4 部门编码规则

#### 2.4.1 编码格式

- **一级单位**: 3位数字，如 `001`, `002`, `003`
- **二级单位**: 父级编码 + 3位数字，如 `001001`, `001002`
- **三级单位**: 父级编码 + 3位数字，如 `001001001`
- **路径格式**: 以斜杠分隔的编码链，如 `/001/001001/001001002/`

示例：
```
001          - 总部
  001001     - 技术部
    001001001 - 研发一组
    001001002 - 研发二组
  001002     - 市场部
002          - 分公司
  002001     - 华东分公司
```

#### 2.4.2 编码生成逻辑

```typescript
// apps/nestjs-backend/src/features/department/department.service.ts

async generateDepartmentCode(parentId?: string): Promise<string> {
  if (!parentId) {
    // 生成一级单位编码
    const maxCode = await this.prismaService.department.findFirst({
      where: { parentId: null },
      orderBy: { code: 'desc' },
      select: { code: true },
    });
    
    const nextNum = maxCode ? parseInt(maxCode.code) + 1 : 1;
    return String(nextNum).padStart(3, '0');
  }
  
  // 生成子单位编码
  const parent = await this.prismaService.department.findUnique({
    where: { id: parentId },
    select: { code: true },
  });
  
  const maxCode = await this.prismaService.department.findFirst({
    where: { parentId },
    orderBy: { code: 'desc' },
    select: { code: true },
  });
  
  const parentCode = parent.code;
  const siblings = maxCode ? parseInt(maxCode.code.slice(parentCode.length)) : 0;
  const nextNum = siblings + 1;
  
  return parentCode + String(nextNum).padStart(3, '0');
}
```

### 2.5 数据查询与过滤

#### 2.5.1 基于单位过滤记录

```typescript
// apps/nestjs-backend/src/features/record/record.service.ts

async getRecordsByDepartment(
  tableId: string,
  departmentCode: string,
  includeChildren: boolean = true
): Promise<IRecord[]> {
  const dbTableName = `table_${tableId}`;
  
  let filter: string;
  if (includeChildren) {
    // 查询该单位及其所有子单位创建的记录
    // 使用 LIKE 查询路径
    filter = `__created_by_department->>'$.path' LIKE '/${departmentCode}/%'`;
  } else {
    // 只查询该单位创建的记录
    filter = `__created_by_department->>'$.code' = '${departmentCode}'`;
  }
  
  const sql = `
    SELECT * FROM ${dbTableName}
    WHERE ${filter}
    AND __deleted_time IS NULL
  `;
  
  return this.prismaService.$queryRawUnsafe(sql);
}
```

#### 2.5.2 视图过滤器支持

在视图的过滤器中添加单位过滤选项：

```typescript
// packages/core/src/models/view/filter/filter.ts

export interface IDepartmentFilter {
  fieldId: string;  // 创建单位字段ID
  operator: 'is' | 'isNot' | 'contains' | 'doesNotContain';
  value: {
    departmentId: string;
    code: string;
    includeChildren?: boolean;  // 是否包含子单位
  };
}
```

#### 2.5.3 查询示例

```sql
-- 查询 001 单位及其子单位创建的所有记录
SELECT * FROM table_xxx
WHERE json_extract(__created_by_department, '$.path') LIKE '/001/%';

-- 查询 001001 单位创建的记录（不含子单位）
SELECT * FROM table_xxx  
WHERE json_extract(__created_by_department, '$.code') = '001001';

-- 查询多个单位的记录
SELECT * FROM table_xxx
WHERE json_extract(__created_by_department, '$.path') LIKE '/001/%'
   OR json_extract(__created_by_department, '$.path') LIKE '/002/%';
```

### 2.6 API 接口设计

#### 2.6.1 单位管理接口

```typescript
// packages/openapi/src/organization/departments.ts

// 创建单位
POST /api/organization/{orgId}/department
{
  name: string;
  parentId?: string;
  description?: string;
  managerId?: string;
}

// 获取单位列表（树形）
GET /api/organization/{orgId}/department
Query: {
  parentId?: string;
  includeChildren?: boolean;
  search?: string;
}

// 获取单位详情
GET /api/organization/{orgId}/department/{deptId}

// 更新单位
PATCH /api/organization/{orgId}/department/{deptId}
{
  name?: string;
  parentId?: string;  // 移动单位
  description?: string;
  managerId?: string;
}

// 删除单位
DELETE /api/organization/{orgId}/department/{deptId}
Query: {
  moveChildrenTo?: string;  // 将子单位移动到指定单位
}
```

#### 2.6.2 用户单位关联接口

```typescript
// 添加用户到单位
POST /api/organization/{orgId}/department/{deptId}/user
{
  userId: string;
  isPrimary?: boolean;
  isAdmin?: boolean;
}

// 从单位移除用户
DELETE /api/organization/{orgId}/department/{deptId}/user/{userId}

// 获取单位成员列表
GET /api/organization/{orgId}/department/{deptId}/user
Query: {
  includeChildren?: boolean;
  skip?: number;
  take?: number;
}
```

### 2.7 记录创建时自动填充

```typescript
// apps/nestjs-backend/src/features/record/record.service.ts

async createRecord(
  tableId: string,
  fields: Record<string, unknown>,
  userId: string
): Promise<IRecord> {
  // 获取用户的主单位
  const userOrg = await this.prismaService.userOrganization.findFirst({
    where: { 
      userId,
      isPrimary: true,
    },
    include: {
      department: true,
    },
  });
  
  const departmentInfo = userOrg ? {
    id: userOrg.department.id,
    name: userOrg.department.name,
    code: userOrg.department.code,
    path: userOrg.department.path,
  } : null;
  
  // 创建记录时自动填充
  const record = {
    __id: generateRecordId(),
    __created_by: userId,
    __created_by_department: JSON.stringify(departmentInfo),  // 新增
    __created_time: new Date(),
    __version: 1,
    ...convertFieldsToDbFormat(fields),
  };
  
  // 插入数据库...
}
```

### 2.8 权限控制扩展

可以基于单位实现更细粒度的权限控制：

```typescript
// 单位级别的记录权限
export interface IDepartmentRecordPermission {
  departmentId: string;
  permission: {
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  scope: {
    onlyOwn: boolean;          // 只能操作本单位的记录
    includeChildren: boolean;  // 包含子单位的记录
  };
}
```

## 三、实现步骤

### 阶段一：数据库基础（1-2周）

1. ✅ 创建 Organization 表 Schema
2. ✅ 创建 Department 表 Schema
3. ✅ 创建 UserOrganization 关联表
4. ✅ 修改 User 表添加关联
5. ✅ 编写数据库迁移脚本
6. ✅ 添加种子数据（测试用）

### 阶段二：后端服务（2-3周）

1. ✅ 实现 OrganizationService
   - 组织CRUD操作
   - 组织配置管理

2. ✅ 实现 DepartmentService
   - 单位CRUD操作
   - 编码生成逻辑
   - 层级查询（获取子树、父路径等）
   - 单位成员管理

3. ✅ 修改 RecordService
   - 创建记录时自动填充单位信息
   - 修改记录时更新单位信息

4. ✅ 实现单位过滤查询
   - 基于编码的LIKE查询
   - 单位树的递归查询

### 阶段三：字段类型支持（1-2周）

1. ✅ 新增 CreatedByDepartment 字段类型
2. ✅ 新增 LastModifiedByDepartment 字段类型
3. ✅ 在表创建时自动添加系统字段
4. ✅ 字段的显示和渲染

### 阶段四：API接口（1周）

1. ✅ 组织管理接口
2. ✅ 单位管理接口
3. ✅ 用户单位关联接口
4. ✅ 基于单位的记录查询接口

### 阶段五：前端界面（2-3周）

1. ✅ 单位管理页面
   - 单位树展示
   - 单位CRUD操作
   - 拖拽调整层级

2. ✅ 单位选择器组件
   - 树形选择
   - 搜索功能
   - 包含子单位选项

3. ✅ 视图过滤器
   - 添加单位过滤条件
   - 支持多单位选择

4. ✅ 字段显示
   - 创建单位字段显示
   - 点击查看单位详情

### 阶段六：测试与优化（1-2周）

1. ✅ 单元测试
2. ✅ 集成测试
3. ✅ 性能优化（索引优化、查询优化）
4. ✅ 文档编写

## 四、查询性能优化

### 4.1 索引策略

```sql
-- Department 表索引
CREATE INDEX idx_department_org_id ON department(organization_id);
CREATE INDEX idx_department_parent_id ON department(parent_id);
CREATE INDEX idx_department_path ON department(path);
CREATE INDEX idx_department_code ON department(organization_id, code);

-- UserOrganization 表索引
CREATE INDEX idx_user_org_user_id ON user_organization(user_id);
CREATE INDEX idx_user_org_dept_id ON user_organization(department_id);
CREATE INDEX idx_user_org_primary ON user_organization(user_id, is_primary) WHERE is_primary = true;

-- 记录表索引（动态创建）
CREATE INDEX idx_created_by_dept ON table_xxx((__created_by_department->>'$.code'));
```

### 4.2 查询优化建议

1. **使用路径字段加速子树查询**
   ```sql
   -- 优化前
   WITH RECURSIVE dept_tree AS (...)
   
   -- 优化后
   WHERE path LIKE '/001/%'
   ```

2. **缓存单位树结构**
   - 使用 Redis 缓存完整的单位树
   - 定期刷新或按需失效

3. **分页查询**
   - 对大量记录的单位进行分页

4. **物化视图**
   - 对常用的单位统计数据建立物化视图

## 五、使用示例

### 5.1 创建单位层级

```typescript
// 创建一级单位
const headquarters = await createDepartment({
  name: '总部',
  organizationId: 'org123',
});
// 自动生成编码: 001

// 创建二级单位
const techDept = await createDepartment({
  name: '技术部',
  organizationId: 'org123',
  parentId: headquarters.id,
});
// 自动生成编码: 001001

// 创建三级单位
const devTeam1 = await createDepartment({
  name: '研发一组',
  organizationId: 'org123',
  parentId: techDept.id,
});
// 自动生成编码: 001001001
```

### 5.2 查询单位的记录

```typescript
// 查询技术部（001001）及其子单位创建的所有记录
const records = await getRecordsByDepartment(
  'tblXXX',
  '001001',
  true  // includeChildren
);

// 查询多个单位的记录
const records = await getRecordsByDepartments(
  'tblXXX',
  ['001001', '001002'],
  true
);
```

### 5.3 视图过滤

```typescript
// 在视图中添加单位过滤
const viewFilter = {
  filterSet: [
    {
      fieldId: 'fld_created_by_dept',
      operator: 'contains',
      value: {
        departmentCode: '001',
        includeChildren: true,
      },
    },
  ],
  conjunction: 'and',
};
```

## 六、注意事项

### 6.1 数据一致性

1. **删除单位时的处理**
   - 软删除：保留历史记录的单位信息
   - 级联更新：将子单位移动到父单位或指定单位

2. **用户离职或调动**
   - 保持历史记录的单位信息不变
   - 更新用户的当前主单位

### 6.2 编码管理

1. **编码唯一性**
   - 在组织范围内保证编码唯一
   - 使用数据库约束确保

2. **编码变更**
   - 不建议修改已使用的编码
   - 如需修改，需要同步更新所有相关记录

### 6.3 性能考虑

1. **大规模单位**
   - 单位数量 > 10000 时考虑分表
   - 使用缓存减少数据库查询

2. **深层级查询**
   - 限制单位层级深度（建议 ≤ 6 层）
   - 使用路径字段而非递归查询

### 6.4 兼容性

1. **现有数据迁移**
   - 为现有记录填充默认单位信息
   - 提供数据迁移工具

2. **向后兼容**
   - 对于没有单位信息的记录，显示"未分配"
   - API 接口支持可选的单位参数

## 七、扩展功能

### 7.1 单位数据权限

可以实现基于单位的行级权限控制：
- 用户只能查看自己单位（及子单位）的数据
- 配置单位间的数据可见性规则

### 7.2 单位统计

- 各单位创建的记录数量统计
- 单位活跃度分析
- 跨单位协作分析

### 7.3 单位模板

- 创建单位时自动创建相关资源
- 单位级别的默认配置

## 八、总结

该方案基于现有的 Organization 和 Department 概念，通过以下方式实现单位数据过滤：

1. **编码层级**：使用类似 `001001` 的编码表示单位层级
2. **路径存储**：使用 `/001/001001/` 格式加速查询
3. **自动字段**：创建记录时自动保存创建人的单位信息
4. **LIKE 查询**：通过路径的 LIKE 查询实现包含子单位的过滤

这个设计既保持了灵活性，又确保了查询性能，同时与现有系统架构良好集成。

