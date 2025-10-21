# Organization vs Department 对比说明

## 一、概念定义

### Organization（组织）
**组织是企业/机构的顶层实体**，代表一个独立的法人或管理主体。

**例如**：
- 某某科技有限公司
- 某某大学
- 某某政府部门

### Department（部门/单位）
**部门是组织内部的业务单元**，具有层级结构，用于组织架构管理。

**例如**：
- 技术部、市场部、人事部
- 华东分公司、华南分公司
- 研发一组、研发二组

## 二、关系图解

```
┌─────────────────────────────────────────────────────┐
│           Organization (某某科技有限公司)              │
│                                                     │
│  ┌───────────────────┐    ┌───────────────────┐   │
│  │   Department      │    │   Department      │   │
│  │   总部 (001)      │    │   分公司 (002)    │   │
│  │                   │    │                   │   │
│  │  ┌──────────┐    │    │  ┌──────────┐    │   │
│  │  │技术部    │    │    │  │华东分公司│    │   │
│  │  │(001001)  │    │    │  │(002001)  │    │   │
│  │  │          │    │    │  │          │    │   │
│  │  │ ┌──────┐ │    │    │  │ ┌──────┐ │    │   │
│  │  │ │研发组│ │    │    │  │ │销售部│ │    │   │
│  │  │ │001001│ │    │    │  │ │002001│ │    │   │
│  │  │ │001   │ │    │    │  │ │001   │ │    │   │
│  │  │ └──────┘ │    │    │  │ └──────┘ │    │   │
│  │  └──────────┘    │    │  └──────────┘    │   │
│  │                   │    │                   │   │
│  │  ┌──────────┐    │    │                   │   │
│  │  │市场部    │    │    │                   │   │
│  │  │(001002)  │    │    │                   │   │
│  │  └──────────┘    │    │                   │   │
│  └───────────────────┘    └───────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 三、对比表格

| 维度 | Organization (组织) | Department (部门/单位) |
|------|-------------------|----------------------|
| **定义** | 企业/机构的顶层实体 | 组织内的业务单元 |
| **数量** | 系统中可以有多个 Organization | 一个 Organization 下有多个 Department |
| **层级** | 单层，无父子关系 | 多层，有树形层级结构 |
| **编码** | 唯一编码（如 ORG001） | 层级编码（如 001, 001001） |
| **独立性** | 完全独立，数据隔离 | 隶属于某个 Organization |
| **用户归属** | 用户可以属于多个 Organization | 用户可以属于同一 Organization 下的多个 Department |
| **典型场景** | 多租户系统、集团公司 | 组织架构管理、权限控制 |

## 四、详细对比

### 4.1 数据结构

#### Organization 表结构
```prisma
model Organization {
  id               String    @id
  name             String              // 组织名称
  code             String    @unique   // 组织编码（唯一）
  description      String?             // 描述
  logo             String?             // Logo
  createdTime      DateTime
  
  departments      Department[]        // 一对多：拥有多个部门
  users            UserOrganization[]  // 多对多：关联用户
}
```

**特点**：
- 无 `parentId`，无层级
- 拥有独立的 Logo、描述等企业信息
- 是数据隔离的边界

#### Department 表结构
```prisma
model Department {
  id               String    @id
  organizationId   String              // 所属组织
  name             String              // 部门名称
  code             String              // 部门编码（001, 001001）
  parentId         String?             // 父部门ID（支持层级）
  level            Int                 // 层级深度
  path             String              // 路径（/001/001001/）
  pathName         String?             // 路径名称
  managerId        String?             // 负责人
  
  organization     Organization        // 多对一：属于某个组织
  parent           Department?         // 多对一：父部门
  children         Department[]        // 一对多：子部门
  users            UserOrganization[]  // 多对多：关联用户
}
```

**特点**：
- 有 `parentId`，支持多层级
- 有 `path`，便于查询整个部门树
- 必须属于某个 Organization

### 4.2 使用场景

#### Organization 的使用场景

**1. 多租户 SaaS 系统**
```
Organization A (公司A)
  - 独立的数据空间
  - 独立的配置
  - 独立的计费

Organization B (公司B)
  - 完全隔离的数据
  - 独立管理
```

**2. 集团公司**
```
Organization: 集团总部
Organization: 子公司A
Organization: 子公司B
```
每个 Organization 可以有独立的管理和数据。

**3. 教育系统**
```
Organization: 清华大学
Organization: 北京大学
Organization: 复旦大学
```
不同学校之间数据完全隔离。

#### Department 的使用场景

**1. 企业组织架构**
```
Organization: 某科技公司
  Department: 总部 (001)
    Department: 技术部 (001001)
      Department: 前端组 (001001001)
      Department: 后端组 (001001002)
    Department: 市场部 (001002)
    Department: 人事部 (001003)
```

**2. 地域分支机构**
```
Organization: 某连锁企业
  Department: 华东区 (001)
    Department: 上海分公司 (001001)
    Department: 杭州分公司 (001002)
  Department: 华南区 (002)
    Department: 广州分公司 (002001)
    Department: 深圳分公司 (002002)
```

**3. 数据权限控制**
- 用户只能查看自己部门的数据
- 部门主管可以查看子部门的数据
- 使用编码 LIKE 查询：`WHERE dept_code LIKE '001%'`

### 4.3 编码系统

#### Organization 编码
```
ORG001  - 某科技有限公司
ORG002  - 某商贸有限公司
ORG003  - 某教育机构
```
- **特点**：全局唯一，简单递增
- **用途**：标识不同的组织实体

#### Department 编码（层级编码）
```
001          - 一级部门（总部）
  001001     - 二级部门（技术部）
    001001001 - 三级部门（研发一组）
    001001002 - 三级部门（研发二组）
  001002     - 二级部门（市场部）
002          - 一级部门（分公司）
  002001     - 二级部门（华东分公司）
```
- **特点**：体现层级关系，支持 LIKE 查询
- **用途**：快速查找部门树、权限控制

### 4.4 数据隔离

#### Organization 级别的隔离
```typescript
// 不同 Organization 的数据完全隔离
SELECT * FROM table_xxx 
WHERE organization_id = 'org123';

// Organization A 的用户看不到 Organization B 的任何数据
```

**隔离内容**：
- ✅ 用户数据
- ✅ 表和记录
- ✅ 视图和配置
- ✅ 权限和角色

#### Department 级别的隔离
```typescript
// 同一 Organization 内，部门间可以配置可见性
SELECT * FROM table_xxx 
WHERE json_extract(__created_by_department, '$.code') LIKE '001%';

// 技术部（001001）可以看到总部（001）的数据（如果配置允许）
```

**隔离内容**：
- ⚠️ 可配置的记录可见性
- ⚠️ 可配置的权限范围
- ✅ 部门统计独立

## 五、用户归属关系

### 5.1 用户与 Organization 的关系

```prisma
model UserOrganization {
  userId         String
  organizationId String
  departmentId   String        // 在该组织内所属的部门
  isPrimary      Boolean       // 是否为主组织
  isAdmin        Boolean       // 是否为组织管理员
}
```

**一个用户可以：**
- ✅ 属于多个 Organization（跨公司兼职、集团员工）
- ✅ 在每个 Organization 中有不同的角色
- ✅ 有一个主 Organization（primary）

**示例**：
```typescript
用户张三：
  - Organization A（主）: 部门：技术部，角色：员工
  - Organization B（兼）: 部门：咨询部，角色：顾问
```

### 5.2 用户与 Department 的关系

**一个用户可以：**
- ✅ 在同一 Organization 内属于多个 Department（兼职）
- ✅ 有一个主 Department（primary）
- ✅ 在不同 Department 有不同权限

**示例**：
```typescript
用户李四（Organization: 某科技公司）：
  - 主部门：技术部 (001001)
  - 兼职部门：市场部 (001002)
  - 创建记录时，使用主部门信息
```

## 六、实际应用示例

### 6.1 场景一：单一企业

```
Organization: 某科技有限公司
  ├─ Department: 研发中心 (001)
  │   ├─ Department: 前端组 (001001)
  │   └─ Department: 后端组 (001002)
  ├─ Department: 销售中心 (002)
  └─ Department: 行政中心 (003)
```

**特点**：
- 只有一个 Organization
- 重点使用 Department 管理内部架构
- Department 编码用于权限控制

### 6.2 场景二：集团公司

```
Organization: 集团总部
  └─ Department: 战略规划部 (001)

Organization: 子公司A
  ├─ Department: 技术部 (001)
  └─ Department: 销售部 (002)

Organization: 子公司B
  ├─ Department: 生产部 (001)
  └─ Department: 质检部 (002)
```

**特点**：
- 多个 Organization，数据独立
- 每个 Organization 内部有自己的 Department 体系
- 可以相同的 Department 编码（因为在不同 Organization 下）

### 6.3 场景三：SaaS 多租户

```
Organization: 客户A公司
  └─ Department: 他们的内部部门结构

Organization: 客户B公司
  └─ Department: 他们的内部部门结构

Organization: 客户C公司
  └─ Department: 他们的内部部门结构
```

**特点**：
- 每个客户是一个 Organization
- 完全的数据隔离
- 每个客户独立管理自己的 Department

## 七、查询示例

### 7.1 Organization 相关查询

```typescript
// 获取用户所属的所有组织
SELECT o.* 
FROM organization o
JOIN user_organization uo ON o.id = uo.organization_id
WHERE uo.user_id = 'user123';

// 获取组织的所有成员
SELECT u.* 
FROM users u
JOIN user_organization uo ON u.id = uo.user_id
WHERE uo.organization_id = 'org123';

// 切换组织上下文
SET @current_org = 'org123';
```

### 7.2 Department 相关查询

```typescript
// 获取部门树（某个组织下）
SELECT * FROM department
WHERE organization_id = 'org123'
ORDER BY path;

// 获取某部门的所有子部门（使用编码）
SELECT * FROM department
WHERE organization_id = 'org123'
  AND code LIKE '001%';

// 获取某部门的所有子部门（使用路径）
SELECT * FROM department
WHERE organization_id = 'org123'
  AND path LIKE '/001/%';

// 获取用户的部门
SELECT d.* 
FROM department d
JOIN user_organization uo ON d.id = uo.department_id
WHERE uo.user_id = 'user123'
  AND uo.organization_id = 'org123';
```

### 7.3 记录过滤查询

```typescript
// 按组织过滤记录
SELECT * FROM records
WHERE organization_id = 'org123';

// 按部门过滤记录（包含子部门）
SELECT * FROM records
WHERE organization_id = 'org123'
  AND json_extract(__created_by_department, '$.code') LIKE '001%';

// 按具体部门过滤（不含子部门）
SELECT * FROM records
WHERE organization_id = 'org123'
  AND json_extract(__created_by_department, '$.code') = '001001';
```

## 八、设计建议

### 8.1 何时使用 Organization

使用 Organization 当：
- ✅ 需要完全的数据隔离
- ✅ 不同实体有独立的配置和管理
- ✅ 多租户 SaaS 系统
- ✅ 集团公司的不同法人实体
- ✅ 需要独立计费和统计

### 8.2 何时使用 Department

使用 Department 当：
- ✅ 需要表示内部组织架构
- ✅ 需要层级化的权限控制
- ✅ 数据在同一管理域内，但需要分类
- ✅ 需要灵活的树形结构
- ✅ 需要统计各部门的数据

### 8.3 推荐实践

**对于大多数企业应用**：
```
1个 Organization（整个公司）
  ├─ 多个 Department（公司内部架构）
  └─ 使用 Department 编码进行权限控制
```

**对于 SaaS 平台**：
```
多个 Organization（每个客户一个）
  └─ 每个 Organization 内有自己的 Department 树
```

**对于集团企业**：
```
多个 Organization（每个子公司一个）
  └─ 每个 Organization 内有自己的 Department 树
集团可以通过应用层逻辑聚合查看
```

## 九、总结

| 特性 | Organization | Department |
|------|--------------|------------|
| **本质** | 顶层实体 | 内部单元 |
| **层级** | 无层级 | 树形层级 |
| **隔离** | 强隔离 | 弱隔离（可配置） |
| **编码** | 简单唯一码 | 层级编码 |
| **数量** | 通常较少 | 可以很多 |
| **独立性** | 完全独立 | 依附于 Organization |
| **典型用途** | 租户/公司 | 部门/分支 |

**简单理解**：
- **Organization** = 公司/企业（Who you work for）
- **Department** = 部门/单位（Which team you're in）

**类比**：
- Organization 就像"国家"，各自独立，边界明确
- Department 就像"省市县"，在国家内部有层级关系

希望这个对比说明能帮助您理解两者的区别！


