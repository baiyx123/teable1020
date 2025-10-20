# 用户多部门归属处理指南

## 一、业务场景

### 1.1 常见的多部门场景

在实际业务中，用户属于多个部门是很常见的情况：

**场景一：兼职/跨部门工作**
```
张三：
  - 主部门：技术部 (001001) - 主要工作
  - 兼职部门：市场部 (001002) - 技术支持
```

**场景二：矩阵式管理**
```
李四：
  - 职能部门：研发中心 (001001) - 归属部门
  - 项目部门：A项目组 (002001) - 项目工作
```

**场景三：多岗位人员**
```
王五：
  - 部门1：人事部 (001003) - 负责招聘
  - 部门2：行政部 (001004) - 负责后勤
```

**场景四：管理人员**
```
总经理：
  - 董事会 (001) - 管理层
  - 技术部 (001001) - 分管技术
  - 市场部 (001002) - 分管市场
```

## 二、数据模型设计

### 2.1 UserOrganization 表（用户-组织-部门关联表）

```prisma
model UserOrganization {
  id             String    @id @default(cuid())
  userId         String    @map("user_id")
  organizationId String    @map("organization_id")
  departmentId   String    @map("department_id")
  
  // 关键字段
  isPrimary      Boolean   @default(false) @map("is_primary")      // 是否为主部门
  isAdmin        Boolean   @default(false) @map("is_admin")        // 是否为部门管理员
  role           String?                                           // 在该部门的角色
  jobTitle       String?   @map("job_title")                       // 在该部门的职位
  workload       Int?                                              // 工作量占比（如：60%）
  
  joinTime       DateTime  @default(now()) @map("join_time")
  leaveTime      DateTime? @map("leave_time")                      // 离开该部门的时间
  
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  department     Department   @relation(fields: [departmentId], references: [id], onDelete: Cascade)
  
  @@unique([userId, organizationId, departmentId])
  @@index([userId])
  @@index([departmentId])
  @@index([userId, isPrimary])  // 快速查找用户的主部门
  @@map("user_organization")
}
```

### 2.2 关键字段说明

| 字段 | 说明 | 用途 |
|------|------|------|
| `isPrimary` | 主部门标识 | 标记用户的主要归属部门，每个用户在同一组织下只能有一个主部门 |
| `isAdmin` | 部门管理员 | 标识该用户是否为该部门的管理员 |
| `role` | 角色 | 描述在该部门的角色（如：成员、负责人、顾问） |
| `jobTitle` | 职位 | 在该部门的具体职位名称 |
| `workload` | 工作量占比 | 用于统计，如主部门70%，兼职部门30% |
| `leaveTime` | 离开时间 | 支持历史记录查询 |

## 三、核心概念：主部门 (Primary Department)

### 3.1 主部门的作用

**主部门**是用户的主要归属部门，具有以下特殊意义：

1. **创建记录时使用主部门**
   ```typescript
   // 用户创建记录时，自动填充主部门信息
   __created_by_department = {
     id: "dept123",
     name: "技术部",
     code: "001001",
     path: "/001/001001/"
   }
   ```

2. **默认权限范围**
   - 用户默认能访问主部门及其子部门的数据
   - 主部门决定用户的基础权限范围

3. **统计和汇报**
   - 人员统计以主部门为准
   - 绩效考核归属主部门

4. **通知和消息**
   - 部门通知优先发送到主部门
   - 部门会议通知基于主部门

### 3.2 主部门的约束

```typescript
// 数据库约束：每个用户在同一组织下只能有一个主部门
@@unique([userId, organizationId, isPrimary])

// 业务逻辑验证
async function setPrimaryDepartment(userId: string, orgId: string, deptId: string) {
  // 1. 取消该用户在该组织下的其他主部门标识
  await prisma.userOrganization.updateMany({
    where: {
      userId,
      organizationId: orgId,
      isPrimary: true,
    },
    data: {
      isPrimary: false,
    },
  });
  
  // 2. 设置新的主部门
  await prisma.userOrganization.upsert({
    where: {
      userId_organizationId_departmentId: {
        userId,
        organizationId: orgId,
        departmentId: deptId,
      },
    },
    update: {
      isPrimary: true,
    },
    create: {
      userId,
      organizationId: orgId,
      departmentId: deptId,
      isPrimary: true,
    },
  });
}
```

## 四、数据操作行为

### 4.1 创建记录时的部门选择

#### 方案一：始终使用主部门（推荐）

```typescript
// 创建记录时，自动使用用户的主部门
async function createRecord(userId: string, tableId: string, fields: any) {
  // 获取用户的主部门
  const primaryDept = await prisma.userOrganization.findFirst({
    where: { 
      userId,
      isPrimary: true,
    },
    include: {
      department: true,
    },
  });
  
  const record = {
    __created_by: userId,
    __created_by_department: JSON.stringify({
      id: primaryDept.department.id,
      name: primaryDept.department.name,
      code: primaryDept.department.code,
      path: primaryDept.department.path,
    }),
    ...fields,
  };
  
  // 插入记录...
}
```

**优点**：
- ✅ 简单明确，不需要用户选择
- ✅ 便于统计（知道是哪个部门创建的）
- ✅ 符合大多数场景的需求

**缺点**：
- ⚠️ 用户在兼职部门工作时创建的数据，仍然归属主部门

#### 方案二：允许用户选择部门

```typescript
// 创建记录时，允许用户选择当前工作的部门
async function createRecordWithDeptChoice(
  userId: string, 
  tableId: string, 
  fields: any,
  selectedDeptId?: string  // 用户选择的部门
) {
  // 如果用户选择了部门，验证用户是否属于该部门
  if (selectedDeptId) {
    const userDept = await prisma.userOrganization.findFirst({
      where: { 
        userId,
        departmentId: selectedDeptId,
      },
      include: {
        department: true,
      },
    });
    
    if (!userDept) {
      throw new Error('用户不属于所选部门');
    }
    
    // 使用用户选择的部门
    const record = {
      __created_by: userId,
      __created_by_department: JSON.stringify({
        id: userDept.department.id,
        name: userDept.department.name,
        code: userDept.department.code,
        path: userDept.department.path,
      }),
      ...fields,
    };
  } else {
    // 未选择则使用主部门
    // ... 同方案一
  }
}
```

**优点**：
- ✅ 更灵活，适合矩阵式管理
- ✅ 数据归属更准确

**缺点**：
- ⚠️ 增加用户操作步骤
- ⚠️ 需要前端UI支持

#### 方案三：基于上下文自动判断

```typescript
// 根据用户当前的工作上下文判断
async function createRecordWithContext(
  userId: string,
  tableId: string,
  fields: any,
  context: {
    viewId?: string,      // 当前视图
    baseId?: string,      // 当前 base
    spaceId?: string,     // 当前 space
  }
) {
  // 1. 尝试从上下文推断部门
  //    例如：base 或 space 可能关联了特定部门
  const contextDept = await inferDepartmentFromContext(context);
  
  // 2. 如果推断失败，使用主部门
  const dept = contextDept || await getPrimaryDepartment(userId);
  
  // 3. 创建记录...
}
```

**优点**：
- ✅ 智能化，无需用户操作
- ✅ 符合实际工作流

**缺点**：
- ⚠️ 实现复杂
- ⚠️ 可能推断错误

### 4.2 推荐方案

**根据业务场景选择**：

1. **简单组织结构** → 使用方案一（始终用主部门）
2. **矩阵式管理/项目制** → 使用方案二（允许选择）
3. **复杂业务系统** → 使用方案三（上下文判断）

## 五、数据权限处理

### 5.1 查询权限：用户可以看到哪些部门的数据？

#### ✅ 本方案采用策略：可以看所有归属部门的数据

**核心逻辑**：
```typescript
// 用户可以看到所有他归属的部门的数据（使用 OR 查询）
async function getAccessibleDepartmentCodes(userId: string): Promise<string[]> {
  const userDepts = await prisma.userOrganization.findMany({
    where: { 
      userId,
      leaveTime: null,  // 排除已离开的部门
    },
    include: { 
      department: {
        select: {
          code: true,
          path: true,
        }
      } 
    },
  });
  
  return userDepts.map(ud => ud.department.code);
}

// 查询时使用 OR 条件
async function getRecordsForUser(userId: string, includeChildren = false) {
  const deptCodes = await getAccessibleDepartmentCodes(userId);
  
  let whereConditions: string[];
  if (includeChildren) {
    // 包含子部门：使用 path LIKE
    whereConditions = deptCodes.map(code => 
      `json_extract(__created_by_department, '$.path') LIKE '/${code}/%'`
    );
  } else {
    // 不包含子部门：精确匹配
    whereConditions = deptCodes.map(code => 
      `json_extract(__created_by_department, '$.code') = '${code}'`
    );
  }
  
  const sql = `
    SELECT * FROM table_xxx
    WHERE (${whereConditions.join(' OR ')})
      AND __deleted_time IS NULL
  `;
  
  return db.$queryRawUnsafe(sql);
}
```

#### 其他可选策略（仅供参考）

<details>
<summary>策略一：只能看主部门的数据（最严格）</summary>

```typescript
// 最严格的权限控制
function getAccessibleDepartmentCodes(userId: string): string[] {
  const primaryDept = await getUserPrimaryDepartment(userId);
  return [primaryDept.code];  // 只返回主部门编码
}
```

**不推荐原因**：限制过严，无法支持跨部门协作
</details>

<details>
<summary>策略三：分级权限（更复杂）</summary>

```typescript
interface DepartmentAccess {
  code: string;
  level: 'full' | 'readonly' | 'restricted';  // 权限级别
  includeChildren: boolean;                    // 是否包含子部门
}

async function getAccessibleDepartments(userId: string): Promise<DepartmentAccess[]> {
  const userDepts = await prisma.userOrganization.findMany({
    where: { userId },
    include: { department: true },
  });
  
  return userDepts.map(ud => ({
    code: ud.department.code,
    level: ud.isPrimary ? 'full' : 'readonly',  // 主部门全权限，兼职部门只读
    includeChildren: ud.isAdmin,                 // 管理员可以看子部门
  }));
}
```

**可作为未来扩展**：需要时可以升级到这个方案
</details>

### 5.2 权限示例

**场景：张三的部门归属**
```typescript
{
  userId: "user123",
  departments: [
    {
      code: "001001",      // 技术部
      isPrimary: true,     // 主部门
      isAdmin: true,       // 是管理员
    },
    {
      code: "001002",      // 市场部
      isPrimary: false,    // 兼职部门
      isAdmin: false,      // 不是管理员
    }
  ]
}
```

**张三的数据权限**：
```typescript
// 技术部（主部门，是管理员）
{
  department: "001001",
  permissions: {
    read: true,
    create: true,
    update: true,
    delete: true,
  },
  scope: {
    includeChildren: true,  // 可以看子部门数据（因为是管理员）
  }
}

// 市场部（兼职部门，非管理员）
{
  department: "001002",
  permissions: {
    read: true,
    create: true,
    update: false,  // 不能修改
    delete: false,  // 不能删除
  },
  scope: {
    includeChildren: false,  // 不能看子部门数据
  }
}
```

## 六、UI/UX 设计

### 6.1 部门切换器

在界面上提供部门切换功能，让用户可以切换工作上下文：

```typescript
// 顶部导航栏
<DepartmentSwitcher>
  <PrimaryDepartment>
    技术部 (主) 🏠
  </PrimaryDepartment>
  <SecondaryDepartments>
    市场部 (兼)
    行政部 (兼)
  </SecondaryDepartments>
</DepartmentSwitcher>
```

**切换部门后的效果**：
- 过滤器默认显示当前部门的数据
- 创建记录时使用当前选择的部门（如果采用方案二）
- 显示当前部门的统计信息

### 6.2 创建记录时的部门选择

```typescript
// 如果采用方案二（允许选择）
<RecordCreateModal>
  <Form>
    {/* 其他字段 */}
    
    <DepartmentSelector
      label="创建部门"
      value={selectedDepartment}
      options={userDepartments}
      defaultValue={primaryDepartment}  // 默认主部门
      highlight="primary"               // 高亮主部门
    >
      <Option value="001001">技术部 (主) ⭐</Option>
      <Option value="001002">市场部 (兼)</Option>
    </DepartmentSelector>
  </Form>
</RecordCreateModal>
```

### 6.3 记录显示

在记录列表中显示创建部门信息：

```typescript
<RecordList>
  <Record>
    <Field name="title">重要项目</Field>
    <Field name="createdBy">张三</Field>
    <Field name="createdByDepartment">
      <DepartmentBadge>
        技术部 (001001)
      </DepartmentBadge>
    </Field>
  </Record>
</RecordList>
```

## 七、实际应用场景

### 7.1 场景一：技术支持人员

**业务需求**：
- 小王主要在技术部工作
- 偶尔需要去市场部提供技术支持

**配置**：
```typescript
{
  userId: "wang",
  departments: [
    { dept: "技术部 (001001)", isPrimary: true, workload: 80 },
    { dept: "市场部 (001002)", isPrimary: false, workload: 20 },
  ]
}
```

**行为**：
- 小王创建的记录默认归属技术部
- 小王可以查看技术部和市场部的数据
- 技术部主管统计时，小王的工作量算在技术部
- 市场部可以看到小王的兼职状态

### 7.2 场景二：项目经理

**业务需求**：
- 李经理在项目管理部
- 同时负责 A 项目和 B 项目

**配置**：
```typescript
{
  userId: "li",
  departments: [
    { dept: "项目管理部 (002)", isPrimary: true, role: "经理" },
    { dept: "A项目组 (003001)", isPrimary: false, role: "项目经理", isAdmin: true },
    { dept: "B项目组 (003002)", isPrimary: false, role: "项目经理", isAdmin: true },
  ]
}
```

**行为**：
- 李经理在创建任务时，可以选择归属到哪个项目
- 李经理可以查看和管理两个项目组的所有数据
- 项目管理部可以看到李经理的所有工作

### 7.3 场景三：高层管理者

**业务需求**：
- 张总分管技术和市场
- 需要查看这两个部门的数据

**配置**：
```typescript
{
  userId: "zhang",
  departments: [
    { dept: "董事会 (001)", isPrimary: true, role: "副总经理" },
    { dept: "技术部 (001001)", isPrimary: false, role: "分管领导", isAdmin: true },
    { dept: "市场部 (001002)", isPrimary: false, role: "分管领导", isAdmin: true },
  ]
}
```

**行为**：
- 张总创建的记录归属董事会
- 张总可以查看技术部和市场部的所有数据（包括子部门）
- 张总具有这两个部门的管理权限

## 八、查询示例

### 8.1 获取用户的所有部门

```sql
-- 获取用户在某个组织下的所有部门
SELECT 
  d.*,
  uo.is_primary,
  uo.is_admin,
  uo.role,
  uo.workload
FROM department d
JOIN user_organization uo ON d.id = uo.department_id
WHERE uo.user_id = 'user123'
  AND uo.organization_id = 'org123'
ORDER BY uo.is_primary DESC, d.code;
```

### 8.2 获取用户可访问的数据

```sql
-- 获取用户在所有归属部门下可以看到的记录
WITH user_depts AS (
  SELECT 
    d.code,
    d.path,
    uo.is_admin
  FROM department d
  JOIN user_organization uo ON d.id = uo.department_id
  WHERE uo.user_id = 'user123'
)
SELECT r.*
FROM records r
WHERE EXISTS (
  SELECT 1 FROM user_depts ud
  WHERE 
    -- 如果是管理员，可以看子部门数据
    (ud.is_admin AND json_extract(r.__created_by_department, '$.path') LIKE ud.path || '%')
    OR
    -- 否则只能看该部门数据
    (NOT ud.is_admin AND json_extract(r.__created_by_department, '$.code') = ud.code)
);
```

### 8.3 统计各部门的数据（去重）

```sql
-- 统计每个部门创建的记录数
-- 注意：用户属于多个部门，但记录只归属一个部门（创建时的部门）
SELECT 
  d.name AS department_name,
  COUNT(DISTINCT r.id) AS record_count
FROM records r
JOIN user_organization uo ON r.__created_by = uo.user_id
JOIN department d ON uo.department_id = d.id
WHERE uo.is_primary = true  -- 只统计主部门
GROUP BY d.id, d.name
ORDER BY record_count DESC;
```

## 九、最佳实践建议

### 9.1 主部门原则

1. ✅ **每个用户必须有一个主部门**
   - 确保数据归属明确
   - 便于统计和汇报

2. ✅ **默认使用主部门创建数据**
   - 除非有特殊需求，否则不要让用户选择
   - 减少用户操作负担

3. ✅ **主部门变更需要审批**
   - 主部门变更影响数据归属
   - 应该有正式的流程

### 9.2 兼职部门管理

1. ✅ **明确兼职部门的权限范围**
   - 是只读还是可写？
   - 是否可以看子部门数据？

2. ✅ **记录工作量占比**
   - 便于绩效考核
   - 便于资源调配

3. ✅ **定期清理无效的兼职关系**
   - 项目结束后及时移除
   - 避免权限泛滥

### 9.3 数据查询优化

1. ✅ **为常用查询添加索引**
   ```sql
   CREATE INDEX idx_user_primary_dept 
   ON user_organization(user_id, is_primary) 
   WHERE is_primary = true;
   ```

2. ✅ **缓存用户的部门信息**
   - 用户登录时加载到会话
   - 减少数据库查询

3. ✅ **使用视图简化查询**
   ```sql
   CREATE VIEW user_departments AS
   SELECT 
     u.id AS user_id,
     d.id AS department_id,
     d.code,
     d.path,
     uo.is_primary,
     uo.is_admin
   FROM users u
   JOIN user_organization uo ON u.id = uo.user_id
   JOIN department d ON uo.department_id = d.id;
   ```

## 十、总结

### 用户多部门归属的核心要点

1. **主部门是核心**
   - 每个用户必须有一个明确的主部门
   - 创建数据默认使用主部门
   - 统计和汇报以主部门为准

2. **兼职部门是补充**
   - 用于表示跨部门工作
   - 可以配置不同的权限级别
   - 灵活但不改变主归属

3. **权限是可配置的**
   - 可以根据是否为主部门、是否为管理员等因素配置不同权限
   - 可以控制是否能看子部门数据
   - 可以设置只读或读写权限

4. **数据归属是明确的**
   - 每条记录只归属一个部门（创建时的部门）
   - 避免统计重复
   - 便于追溯和审计

**简单记忆**：
- 一个用户 → 一个主部门（必须） + 多个兼职部门（可选）
- 创建数据 → 始终使用主部门
- 查看数据 → 所有归属部门的数据（使用 OR 查询）
- 统计汇报 → 以主部门为准

## 十一、本方案明确的策略

### ✅ 最终采用方案

基于您的需求，我们明确采用以下策略：

1. **多部门归属**
   ```
   ✅ 允许用户属于多个部门
   ✅ 每个用户必须有一个主部门
   ```

2. **创建记录**
   ```
   ✅ 始终使用用户的主部门
   ✅ 不需要用户手动选择
   ```

3. **查询记录**
   ```
   ✅ 可以看所有归属部门的数据
   ✅ 使用 OR 条件组合多个部门
   ✅ 示例：WHERE (code = '001' OR code = '002' OR code = '003')
   ```

### 核心代码示例

```typescript
// ============================================
// 1. 创建记录：使用主部门
// ============================================
async function createRecord(userId: string, data: any) {
  // 获取主部门
  const primaryDept = await prisma.userOrganization.findFirst({
    where: { userId, isPrimary: true },
    include: { department: true },
  });
  
  // 使用主部门信息
  const record = {
    ...data,
    __created_by: userId,
    __created_by_department: JSON.stringify({
      id: primaryDept.department.id,
      name: primaryDept.department.name,
      code: primaryDept.department.code,
      path: primaryDept.department.path,
    }),
  };
  
  return await insertRecord(record);
}

// ============================================
// 2. 查询记录：所有归属部门的数据
// ============================================
async function getRecordsForUser(userId: string, includeChildren = false) {
  // 2.1 获取用户的所有部门编码
  const userDepts = await prisma.userOrganization.findMany({
    where: { userId, leaveTime: null },
    include: { department: { select: { code: true } } },
  });
  
  const deptCodes = userDepts.map(ud => ud.department.code);
  
  // 2.2 构建 OR 查询条件
  let conditions: string[];
  if (includeChildren) {
    // 包含子部门
    conditions = deptCodes.map(code => 
      `json_extract(__created_by_department, '$.path') LIKE '/${code}/%'`
    );
  } else {
    // 不包含子部门（推荐，性能更好）
    conditions = deptCodes.map(code => 
      `json_extract(__created_by_department, '$.code') = '${code}'`
    );
  }
  
  // 2.3 执行查询
  const sql = `
    SELECT * FROM table_xxx
    WHERE (${conditions.join(' OR ')})
      AND __deleted_time IS NULL
  `;
  
  return await db.$queryRawUnsafe(sql);
}
```

### 实际示例

**用户信息**：
```
张三的部门：
  - 技术部 (001001) [主部门]
  - 市场部 (001002) [兼职]
  - 产品部 (002001) [兼职]
```

**创建记录**：
```typescript
// 张三创建了一条记录
await createRecord('zhangsan', { title: '新项目' });

// 结果：记录的 __created_by_department 为技术部 (001001)
{
  title: "新项目",
  __created_by: "zhangsan",
  __created_by_department: {
    id: "dept_001001",
    name: "技术部",
    code: "001001",
    path: "/001/001001/"
  }
}
```

**查询记录**：
```typescript
// 张三查询记录
await getRecordsForUser('zhangsan');

// 生成的 SQL：
SELECT * FROM table_xxx
WHERE (
  json_extract(__created_by_department, '$.code') = '001001'  -- 技术部的数据
  OR json_extract(__created_by_department, '$.code') = '001002'  -- 市场部的数据
  OR json_extract(__created_by_department, '$.code') = '002001'  -- 产品部的数据
)
AND __deleted_time IS NULL

// 结果：张三能看到这三个部门创建的所有数据
```

### 性能保障

1. **缓存部门列表**（避免每次查询数据库）
2. **虚拟列 + 索引**（加速 JSON 字段查询）
3. **限制部门数量**（建议 ≤ 10 个）
4. **使用精确匹配**（不包含子部门时，性能最优）

这个方案兼顾了灵活性和性能，满足您的需求！

