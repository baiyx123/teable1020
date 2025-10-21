# IAM 系统设计方案（Identity and Access Management）

## 一、系统概述

### 1.1 为什么需要独立的 IAM 系统？

基于前面的讨论，我们发现用户、部门、角色、权限管理是一个复杂且独立的领域，包括：

- 组织架构管理（Organization、Department）
- 用户管理（User、多部门归属）
- 角色与权限（Role、Permission、RBAC）
- 部门变更（调岗、合并、拆分）
- 审计与追溯

**将其独立成 IAM 系统的优势**：

1. ✅ **关注点分离**：Teable 专注于数据表格管理，IAM 专注于身份权限
2. ✅ **可复用性**：其他系统也可以使用同一个 IAM
3. ✅ **专业性**：可以做得更深入、更完善
4. ✅ **可扩展性**：独立部署、独立扩展
5. ✅ **易维护性**：独立团队、独立升级
6. ✅ **安全性**：统一的身份认证和权限控制

### 1.2 系统定位

```
┌─────────────────────────────────────────────────────────┐
│                    IAM 系统（核心）                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │组织管理  │  │用户管理  │  │角色权限  │  │审计日志 │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              SDK / API Gateway                     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
            ┌─────────────┼─────────────┐
            ↓             ↓             ↓
      ┌─────────┐   ┌─────────┐   ┌─────────┐
      │ Teable  │   │ 系统 B  │   │ 系统 C  │
      └─────────┘   └─────────┘   └─────────┘
```

## 二、核心功能模块

### 2.1 组织架构管理

**功能**：
- Organization（组织）的 CRUD
- Department（部门）的树形管理
- 部门层级编码（001、001001）
- 部门合并、拆分、重组
- 部门成员管理

**特性**：
- 支持多组织（Multi-tenancy）
- 灵活的层级结构
- 历史记录追溯
- 软删除机制

### 2.2 用户管理

**功能**：
- 用户注册、登录、注销
- 用户信息管理
- 多部门归属
- 主部门机制
- 用户调岗、离职
- 用户状态管理（激活、禁用、锁定）

**特性**：
- 支持多种认证方式（密码、OAuth、SAML）
- 支持 SSO（单点登录）
- 用户分组
- 用户标签

### 2.3 角色与权限管理（RBAC）

**功能**：
- 角色定义（Role）
- 权限定义（Permission）
- 角色-权限关联
- 用户-角色关联
- 权限继承
- 动态权限计算

**特性**：
- 基于角色的访问控制（RBAC）
- 支持权限组
- 支持权限模板
- 细粒度权限控制

### 2.4 审计与日志

**功能**：
- 操作日志记录
- 登录日志
- 权限变更日志
- 部门变更历史
- 数据访问日志

**特性**：
- 完整的审计追踪
- 日志查询和分析
- 导出和归档
- 实时告警

## 三、技术架构

### 3.1 整体架构

```
┌────────────────────────────────────────────────────────────┐
│                        前端层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ IAM 管理后台 │  │ SDK (JS/TS)  │  │ SDK (其他语言)   │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│                      API Gateway                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ 认证中心   │  │ 限流控制   │  │ API 文档   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│                      服务层（微服务）                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │组织服务      │  │用户服务      │  │权限服务          │  │
│  │Organization  │  │User Service  │  │Permission       │  │
│  │Service       │  │              │  │Service          │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │部门服务      │  │角色服务      │  │审计服务          │  │
│  │Department    │  │Role Service  │  │Audit Service    │  │
│  │Service       │  │              │  │                 │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│                      数据层                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ PostgreSQL   │  │ Redis        │  │ Elasticsearch   │  │
│  │ (主数据)     │  │ (缓存)       │  │ (日志搜索)      │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 3.2 技术栈选择

**后端**：
- 语言：Node.js (NestJS) 或 Go
- 框架：NestJS (微服务支持)
- 数据库：PostgreSQL（主数据）
- 缓存：Redis
- 搜索：Elasticsearch（日志和审计）
- 消息队列：RabbitMQ / Kafka（异步任务）

**前端**：
- 框架：React / Vue
- UI 库：Ant Design / Element Plus
- 状态管理：Redux / Vuex
- 请求库：Axios

**SDK**：
- JavaScript/TypeScript SDK
- Python SDK
- Java SDK
- Go SDK

## 四、数据模型设计

### 4.1 核心表结构

```prisma
// ========== 组织相关 ==========
model Organization {
  id          String   @id @default(cuid())
  name        String
  code        String   @unique
  logo        String?
  domain      String?  // 独立域名
  config      Json?    // 组织配置
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  departments Department[]
  users       UserOrganization[]
  roles       Role[]
}

model Department {
  id               String    @id @default(cuid())
  organizationId   String
  name             String
  code             String    // 层级编码
  parentId         String?
  level            Int
  path             String
  pathName         String?
  
  status           String    @default("active")
  mergedIntoId     String?
  mergedAt         DateTime?
  historicalCodes  Json?     // 合并历史编码
  
  metadata         Json?     // 扩展字段
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  
  organization     Organization @relation(fields: [organizationId], references: [id])
  parent           Department?  @relation("Hierarchy", fields: [parentId], references: [id])
  children         Department[] @relation("Hierarchy")
  users            UserOrganization[]
  
  @@unique([organizationId, code])
  @@index([status])
}

// ========== 用户相关 ==========
model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  phone         String?   @unique
  password      String?   // 哈希后的密码
  avatar        String?
  status        String    @default("active")
  
  metadata      Json?
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  organizations UserOrganization[]
  roles         UserRole[]
  sessions      UserSession[]
  auditLogs     AuditLog[]
}

model UserOrganization {
  id             String    @id @default(cuid())
  userId         String
  organizationId String
  departmentId   String
  
  isPrimary      Boolean   @default(false)
  isAdmin        Boolean   @default(false)
  role           String?
  workload       Int?
  
  joinTime       DateTime  @default(now())
  leaveTime      DateTime?
  
  metadata       Json?
  
  user           User         @relation(fields: [userId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])
  department     Department   @relation(fields: [departmentId], references: [id])
  
  @@unique([userId, organizationId, departmentId])
  @@index([userId, isPrimary])
}

// ========== 角色权限相关 ==========
model Role {
  id             String   @id @default(cuid())
  organizationId String?  // NULL = 全局角色
  name           String
  code           String
  description    String?
  type           String   // system/custom/department
  
  isBuiltIn      Boolean  @default(false)
  metadata       Json?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  organization   Organization? @relation(fields: [organizationId], references: [id])
  permissions    RolePermission[]
  users          UserRole[]
  
  @@unique([organizationId, code])
}

model Permission {
  id          String   @id @default(cuid())
  resource    String   // 资源类型：user, department, record, etc.
  action      String   // 动作：create, read, update, delete, etc.
  scope       String?  // 范围：own, department, organization, all
  conditions  Json?    // 条件表达式
  
  description String?
  metadata    Json?
  createdAt   DateTime @default(now())
  
  roles       RolePermission[]
  
  @@unique([resource, action, scope])
}

model RolePermission {
  id           String     @id @default(cuid())
  roleId       String
  permissionId String
  
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  
  @@unique([roleId, permissionId])
}

model UserRole {
  id        String   @id @default(cuid())
  userId    String
  roleId    String
  scope     String?  // department/organization/global
  scopeId   String?  // 对应的 ID
  
  grantedAt DateTime @default(now())
  grantedBy String?
  expiresAt DateTime?
  
  user      User     @relation(fields: [userId], references: [id])
  role      Role     @relation(fields: [roleId], references: [id])
  
  @@unique([userId, roleId, scope, scopeId])
}

// ========== 审计日志 ==========
model AuditLog {
  id             String   @id @default(cuid())
  organizationId String?
  userId         String?
  
  action         String   // login, create_user, update_role, etc.
  resource       String   // user, department, role, etc.
  resourceId     String?
  
  before         Json?    // 变更前数据
  after          Json?    // 变更后数据
  
  ipAddress      String?
  userAgent      String?
  metadata       Json?
  
  createdAt      DateTime @default(now())
  
  user           User?    @relation(fields: [userId], references: [id])
  
  @@index([userId, createdAt])
  @@index([organizationId, createdAt])
  @@index([action, createdAt])
}

// ========== 会话管理 ==========
model UserSession {
  id           String    @id @default(cuid())
  userId       String
  token        String    @unique
  refreshToken String?   @unique
  
  ipAddress    String?
  userAgent    String?
  deviceInfo   Json?
  
  expiresAt    DateTime
  createdAt    DateTime  @default(now())
  lastActiveAt DateTime  @default(now())
  
  user         User      @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([expiresAt])
}
```

### 4.2 权限模型（细粒度）

```typescript
// 权限定义示例
interface IPermission {
  id: string;
  resource: string;    // 资源：user, department, role, record, view, etc.
  action: string;      // 动作：create, read, update, delete, share, export, etc.
  scope: string;       // 范围：own, department, organization, all
  conditions?: {       // 条件（可选）
    field?: string;    // 字段级权限
    value?: any;       // 值条件
    expression?: string; // 表达式：如 "department.code LIKE '001%'"
  };
}

// 权限示例
const permissions = [
  {
    resource: 'record',
    action: 'read',
    scope: 'department',
    conditions: {
      expression: "created_by_department.code IN user.departments.codes"
    }
  },
  {
    resource: 'user',
    action: 'update',
    scope: 'own'  // 只能修改自己
  },
  {
    resource: 'department',
    action: 'manage',
    scope: 'department',  // 部门管理员可以管理本部门
  }
];
```

## 五、SDK 设计

### 5.1 JavaScript/TypeScript SDK

```typescript
// ========== 安装 ==========
// npm install @iam-system/sdk

// ========== 初始化 ==========
import { IAMClient } from '@iam-system/sdk';

const iam = new IAMClient({
  apiUrl: 'https://iam.example.com',
  apiKey: 'your-api-key',
  organizationId: 'org123',
});

// ========== 用户管理 ==========
// 创建用户
const user = await iam.users.create({
  username: 'john',
  email: 'john@example.com',
  departmentId: 'dept_001',
  isPrimary: true,
});

// 获取用户信息
const user = await iam.users.get('user123');

// 获取用户的部门
const departments = await iam.users.getDepartments('user123');

// 更新用户
await iam.users.update('user123', {
  avatar: 'https://...',
});

// ========== 部门管理 ==========
// 创建部门
const dept = await iam.departments.create({
  name: '技术部',
  parentId: 'dept_root',
});

// 获取部门树
const tree = await iam.departments.getTree();

// 合并部门
await iam.departments.merge({
  sourceDeptIds: ['dept_001', 'dept_002'],
  targetDeptId: 'dept_003',
  reason: '组织架构调整',
});

// 获取部门成员
const members = await iam.departments.getMembers('dept_001', {
  includeChildren: true,
});

// ========== 角色权限 ==========
// 创建角色
const role = await iam.roles.create({
  name: '部门经理',
  code: 'dept_manager',
  permissions: [
    'department:read',
    'department:update',
    'user:read',
    'record:read:department',
  ],
});

// 分配角色给用户
await iam.users.assignRole('user123', 'role_manager', {
  scope: 'department',
  scopeId: 'dept_001',
});

// 检查权限
const hasPermission = await iam.permissions.check({
  userId: 'user123',
  resource: 'record',
  action: 'update',
  resourceId: 'record_456',
});

// 获取用户权限列表
const permissions = await iam.users.getPermissions('user123');

// ========== 认证相关 ==========
// 登录
const session = await iam.auth.login({
  username: 'john',
  password: 'password',
});

// 验证 Token
const user = await iam.auth.verify(session.token);

// 刷新 Token
const newSession = await iam.auth.refresh(session.refreshToken);

// 登出
await iam.auth.logout(session.token);

// ========== 查询相关 ==========
// 获取用户可访问的部门编码（用于数据过滤）
const deptCodes = await iam.users.getAccessibleDepartmentCodes('user123');
// 返回：['001001', '001002', '002001']

// 在 Teable 中使用
const records = await teableDB.query(`
  SELECT * FROM records
  WHERE json_extract(created_by_department, '$.code') IN (${deptCodes.join(',')})
`);

// ========== 审计日志 ==========
// 记录操作
await iam.audit.log({
  action: 'record:create',
  resource: 'record',
  resourceId: 'record_123',
  metadata: {
    table: 'projects',
    department: 'dept_001',
  },
});

// 查询审计日志
const logs = await iam.audit.query({
  userId: 'user123',
  action: 'record:update',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});
```

### 5.2 SDK 高级特性

```typescript
// ========== 缓存策略 ==========
const iam = new IAMClient({
  apiUrl: 'https://iam.example.com',
  apiKey: 'your-api-key',
  cache: {
    enabled: true,
    ttl: 3600,  // 1小时
    storage: 'memory',  // memory / redis
  },
});

// ========== 批量操作 ==========
// 批量检查权限
const results = await iam.permissions.checkBatch([
  { userId: 'user1', action: 'record:read', resourceId: 'rec1' },
  { userId: 'user1', action: 'record:update', resourceId: 'rec2' },
  { userId: 'user2', action: 'record:delete', resourceId: 'rec3' },
]);

// ========== Webhook ==========
// 订阅事件
iam.on('user.created', (event) => {
  console.log('New user:', event.data);
});

iam.on('department.merged', (event) => {
  console.log('Departments merged:', event.data);
  // 清除应用侧的缓存
  clearCache();
});

// ========== 中间件（用于 Express/Koa）==========
import { iamMiddleware } from '@iam-system/sdk/middleware';

// 认证中间件
app.use(iamMiddleware.authenticate());

// 权限检查中间件
app.get('/api/records/:id', 
  iamMiddleware.requirePermission('record:read'),
  async (req, res) => {
    // 处理请求
  }
);

// 部门过滤中间件
app.get('/api/records',
  iamMiddleware.filterByDepartment(),
  async (req, res) => {
    // req.user.departmentCodes 已经自动注入
    const codes = req.user.departmentCodes;
    // 使用 codes 过滤数据
  }
);

// ========== React Hooks ==========
import { useIAM, usePermission, useDepartments } from '@iam-system/react';

function MyComponent() {
  const { user, loading } = useIAM();
  const canEdit = usePermission('record:update');
  const { departments, primaryDepartment } = useDepartments(user?.id);
  
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>部门: {primaryDepartment?.name}</p>
      {canEdit && <Button>编辑</Button>}
    </div>
  );
}
```

## 六、与 Teable 集成

### 6.1 集成架构

```
┌────────────────────────────────────────────┐
│              Teable 应用                    │
│                                            │
│  ┌─────────────┐      ┌─────────────┐     │
│  │  前端组件   │      │  后端服务   │     │
│  │             │      │             │     │
│  │  - 用户选择 │      │  - 记录查询 │     │
│  │  - 部门过滤 │      │  - 权限检查 │     │
│  │  - 权限展示 │      │  - 审计日志 │     │
│  └──────┬──────┘      └──────┬──────┘     │
│         │                    │            │
│         ↓                    ↓            │
│  ┌─────────────────────────────────────┐  │
│  │        IAM SDK                      │  │
│  │  - 用户管理                         │  │
│  │  - 部门查询                         │  │
│  │  - 权限验证                         │  │
│  └──────────────┬──────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │
                  ↓
        ┌─────────────────┐
        │   IAM 系统      │
        │  (独立服务)      │
        └─────────────────┘
```

### 6.2 Teable 侧改造

```typescript
// apps/nestjs-backend/src/features/record/record.service.ts

import { IAMClient } from '@iam-system/sdk';

@Injectable()
export class RecordService {
  private iam: IAMClient;
  
  constructor() {
    this.iam = new IAMClient({
      apiUrl: process.env.IAM_API_URL,
      apiKey: process.env.IAM_API_KEY,
    });
  }
  
  // 创建记录
  async createRecord(userId: string, data: any) {
    // 1. 获取用户的主部门
    const primaryDept = await this.iam.users.getPrimaryDepartment(userId);
    
    // 2. 创建记录，使用主部门信息
    const record = {
      ...data,
      __created_by: userId,
      __created_by_department: primaryDept,
    };
    
    // 3. 记录审计日志
    await this.iam.audit.log({
      action: 'record:create',
      resource: 'record',
      resourceId: record.id,
    });
    
    return record;
  }
  
  // 查询记录（带部门过滤）
  async getRecordsForUser(userId: string) {
    // 1. 获取用户可访问的部门编码
    const deptCodes = await this.iam.users.getAccessibleDepartmentCodes(userId);
    
    // 2. 构建查询条件
    const conditions = deptCodes.map(code => 
      `json_extract(__created_by_department, '$.code') = '${code}'`
    );
    
    // 3. 查询数据
    const sql = `
      SELECT * FROM table_xxx
      WHERE (${conditions.join(' OR ')})
        AND __deleted_time IS NULL
    `;
    
    return this.db.$queryRawUnsafe(sql);
  }
  
  // 检查权限
  async canUpdateRecord(userId: string, recordId: string): Promise<boolean> {
    return await this.iam.permissions.check({
      userId,
      resource: 'record',
      action: 'update',
      resourceId: recordId,
    });
  }
}
```

### 6.3 前端集成

```typescript
// apps/nextjs-app/src/components/DepartmentSelector.tsx

import { useIAM } from '@iam-system/react';

export function DepartmentSelector() {
  const { user } = useIAM();
  const [departments, setDepartments] = useState([]);
  
  useEffect(() => {
    // 从 IAM 系统获取用户的部门列表
    fetchDepartments();
  }, [user]);
  
  const fetchDepartments = async () => {
    const depts = await iam.users.getDepartments(user.id);
    setDepartments(depts);
  };
  
  return (
    <Select>
      {departments.map(dept => (
        <Option key={dept.id} value={dept.id}>
          {dept.name} {dept.isPrimary && '(主)'}
        </Option>
      ))}
    </Select>
  );
}
```

## 七、部署方案

### 7.1 独立部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  # IAM 系统
  iam-api:
    image: iam-system:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://iam:password@postgres:5432/iam
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret
    depends_on:
      - postgres
      - redis
  
  # PostgreSQL
  postgres:
    image: postgres:15
    volumes:
      - iam-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=iam
      - POSTGRES_USER=iam
      - POSTGRES_PASSWORD=password
  
  # Redis
  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
  
  # Elasticsearch (审计日志)
  elasticsearch:
    image: elasticsearch:8.9.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - es-data:/usr/share/elasticsearch/data

volumes:
  iam-data:
  redis-data:
  es-data:
```

### 7.2 Kubernetes 部署

```yaml
# k8s/iam-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iam-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: iam-api
  template:
    metadata:
      labels:
        app: iam-api
    spec:
      containers:
      - name: iam-api
        image: iam-system:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: iam-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: iam-secrets
              key: redis-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: iam-api
spec:
  selector:
    app: iam-api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 八、开发路线图

### Phase 1: 核心功能（3-4个月）
- ✅ 组织和部门管理
- ✅ 用户管理和认证
- ✅ 基础 RBAC
- ✅ 基础 API

### Phase 2: 高级功能（2-3个月）
- ✅ 部门合并/拆分
- ✅ 多部门归属
- ✅ 细粒度权限
- ✅ 审计日志

### Phase 3: SDK 和集成（2个月）
- ✅ JavaScript/TypeScript SDK
- ✅ React Hooks
- ✅ 中间件
- ✅ 文档和示例

### Phase 4: 企业特性（2-3个月）
- ✅ SSO 集成
- ✅ LDAP/AD 同步
- ✅ 审批流程
- ✅ 高级审计

### Phase 5: 多语言 SDK（持续）
- ✅ Python SDK
- ✅ Java SDK
- ✅ Go SDK
- ✅ PHP SDK

## 九、商业化考虑

### 9.1 开源 vs 商业版

**开源版本（社区版）**：
- 核心 IAM 功能
- 基础 RBAC
- PostgreSQL 支持
- JavaScript SDK
- MIT/Apache 2.0 许可证

**商业版本（企业版）**：
- 高级权限模型
- SSO 集成（SAML、OAuth）
- LDAP/AD 同步
- 审批流程
- 高级审计和报表
- 多语言 SDK
- 技术支持

### 9.2 定价模型

- **免费版**：<100 用户
- **专业版**：$99/月，<1000 用户
- **企业版**：$499/月，无限用户
- **私有部署**：一次性费用 + 年度维护

## 十、总结

### 10.1 核心价值

1. **专业化**：专注于 IAM 领域，做深做透
2. **可复用**：一套系统服务多个应用
3. **解耦**：业务系统专注业务逻辑
4. **标准化**：提供标准的 IAM 能力
5. **可扩展**：支持各种认证和权限模型

### 10.2 技术优势

- 🚀 **高性能**：缓存优化，支持高并发
- 🔒 **安全**：加密存储，安全审计
- 📈 **可扩展**：微服务架构，水平扩展
- 🛠 **易集成**：SDK + 中间件，快速接入
- 📊 **可观测**：完整的审计和监控

### 10.3 下一步行动

1. **技术选型确认**
2. **详细设计文档**
3. **MVP 开发（核心功能）**
4. **SDK 开发**
5. **Teable 集成验证**
6. **文档和示例**
7. **开源发布**

---

**这是一个长期的、有价值的项目！**

可以先从核心功能开始，逐步迭代，最终打造一个通用的、专业的 IAM 系统。


