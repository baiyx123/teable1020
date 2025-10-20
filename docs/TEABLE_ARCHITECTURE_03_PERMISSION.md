# Teable 技术架构文档 - Part 3: 权限控制系统

## 🔐 权限系统架构

Teable 采用**基于角色的访问控制（RBAC）**，结合**细粒度的资源权限**。

---

## 1️⃣ 角色定义

### 五种核心角色

```typescript
enum Role {
  Owner = 'owner',        // 所有者
  Creator = 'creator',    // 创建者
  Editor = 'editor',      // 编辑者
  Commenter = 'commenter', // 评论者
  Viewer = 'viewer',      // 查看者
}
```

### 角色权限矩阵

| 权限动作 | Owner | Creator | Editor | Commenter | Viewer |
|---------|-------|---------|--------|-----------|--------|
| **Space** |
| space\|create | ✅ | ❌ | ❌ | ❌ | ❌ |
| space\|delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| space\|update | ✅ | ❌ | ❌ | ❌ | ❌ |
| space\|read | ✅ | ✅ | ✅ | ✅ | ✅ |
| space\|grant_role | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Base** |
| base\|create | ✅ | ✅ | ❌ | ❌ | ❌ |
| base\|delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| base\|update | ✅ | ✅ | ❌ | ❌ | ❌ |
| base\|read | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Table** |
| table\|create | ✅ | ✅ | ❌ | ❌ | ❌ |
| table\|delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| table\|update | ✅ | ✅ | ❌ | ❌ | ❌ |
| table\|read | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Field** |
| field\|create | ✅ | ✅ | ❌ | ❌ | ❌ |
| field\|delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| field\|update | ✅ | ✅ | ❌ | ❌ | ❌ |
| field\|read | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Record** |
| record\|create | ✅ | ✅ | ✅ | ❌ | ❌ |
| record\|delete | ✅ | ✅ | ✅ | ❌ | ❌ |
| record\|update | ✅ | ✅ | ✅ | ❌ | ❌ |
| record\|read | ✅ | ✅ | ✅ | ✅ | ✅ |
| record\|comment | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View** |
| view\|create | ✅ | ✅ | ✅ | ❌ | ❌ |
| view\|delete | ✅ | ✅ | ✅ | ❌ | ❌ |
| view\|update | ✅ | ✅ | ✅ | ❌ | ❌ |
| view\|read | ✅ | ✅ | ✅ | ✅ | ✅ |
| view\|share | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 2️⃣ 权限层级

```
Organization (组织)
    ↓
Space (空间)
    ↓
Base (数据库)
    ↓
Table (表格)
    ↓
View (视图) / Field (字段) / Record (记录)
```

### 权限继承规则

1. **向下继承**：上层权限自动应用到下层
   - Space Owner → 自动是所有 Base 的 Owner
   - Base Creator → 自动是所有 Table 的 Creator

2. **细粒度控制**：可以在每层单独设置
   - 某人是 Space Viewer
   - 但可以是特定 Base 的 Editor

3. **最小权限原则**：取所有层级的最小权限
   ```
   Space: Editor
   Base:  Owner
   结果 → Editor（取最小）
   ```

---

## 3️⃣ 权限检查流程

### 前端权限检查

```typescript
// 使用 Hook 获取权限
const permission = useTablePermission();

// 条件渲染
{permission['record|update'] && (
  <Button onClick={handleUpdate}>更新</Button>
)}

// 功能禁用
<Input 
  disabled={!permission['field|update']}
  onChange={handleChange}
/>

// 权限包装函数
const getAuthorizedFunction = (fn, action) => {
  return permission[action] ? fn : undefined;
};

<Grid
  onCellEdited={getAuthorizedFunction(onCellEdited, 'record|update')}
  onColumnAppend={getAuthorizedFunction(onColumnAppend, 'field|create')}
/>
```

### 后端权限检查

#### 方式 1：装饰器（推荐）

```typescript
// Controller 中使用装饰器
@Permissions('record|update')
@Patch(':recordId')
async updateRecord(
  @Param('tableId') tableId: string,
  @Param('recordId') recordId: string,
  @Body() updateRecordRo: IUpdateRecordRo
): Promise<IRecord> {
  return await this.recordOpenApiService.updateRecord(...);
}
```

#### 方式 2：Guard

```typescript
// 全局 Guard
@UseGuards(PermissionsGuard)
export class RecordOpenApiController {
  // ...
}
```

#### 方式 3：Service 层手动检查

```typescript
async updateRecord(...) {
  // 检查权限
  const hasPermission = await this.permissionService.checkPermission(
    userId,
    tableId,
    'record|update'
  );
  
  if (!hasPermission) {
    throw new ForbiddenException('No permission to update record');
  }
  
  // 执行操作
  // ...
}
```

---

## 4️⃣ 权限服务实现

### PermissionService

```typescript
@Injectable()
export class PermissionService {
  // 获取用户在资源上的角色
  async getRole(
    userId: string,
    resourceId: string,
    resourceType: 'space' | 'base'
  ): Promise<IRole>
  
  // 检查权限
  async checkPermission(
    userId: string,
    resourceId: string,
    action: Action
  ): Promise<boolean> {
    const role = await this.getRole(userId, resourceId, type);
    return hasPermission(role, action);
  }
  
  // 获取用户权限 Map
  async getPermissionMap(
    userId: string,
    resourceId: string
  ): Promise<Record<Action, boolean>> {
    const role = await this.getRole(...);
    return getPermissionMap(role);
  }
}
```

### RecordPermissionService

特殊的记录级权限：

```typescript
@Injectable()
export class RecordPermissionService {
  // 字段级权限过滤
  async getFieldPermission(
    tableId: string,
    fieldIds: string[]
  ): Promise<{
    read: string[];   // 可读字段
    update: string[]; // 可写字段
  }>
  
  // 记录权限过滤
  async filterRecordsByPermission(
    records: IRecord[],
    permissions: IPermissions
  ): Promise<IRecord[]> {
    return records.map(record => {
      // 过滤不可读的字段
      const visibleFields = Object.keys(record.fields)
        .filter(fieldId => permissions.read[fieldId])
        .reduce((acc, fieldId) => {
          acc[fieldId] = record.fields[fieldId];
          return acc;
        }, {});
      
      return {
        ...record,
        fields: visibleFields,
        permissions: {
          read: permissions.read,
          update: permissions.update,
        },
      };
    });
  }
}
```

---

## 5️⃣ 字段级权限（细粒度控制）

### 字段权限配置

某些字段可以设置为：
- **只读**（所有人只能查看）
- **隐藏**（特定角色不可见）
- **必填**（创建时必须提供）

```typescript
// 字段权限在记录中返回
interface IRecord {
  id: string;
  fields: Record<string, unknown>;
  permissions?: {
    read: Record<string, boolean>;   // 可读字段
    update: Record<string, boolean>; // 可写字段
  };
}

// 前端使用
const canEdit = record.permissions?.update?.[fieldId] ?? true;
const canRead = record.permissions?.read?.[fieldId] ?? true;
```

---

## 6️⃣ 视图共享权限

### 共享视图的权限

```typescript
// 共享链接权限
interface IShareViewMeta {
  includeRecords?: boolean;     // 是否包含记录
  includeHiddenFields?: boolean; // 是否包含隐藏字段
  password?: string;            // 访问密码
  submit?: {                    // 表单提交权限
    allow: boolean;
    requireLogin: boolean;
  };
}

// 共享视图只有限定权限
type ShareViewAction = 
  | 'view|read'
  | 'field|read'
  | 'record|read'
  | 'record|create'  // 仅表单视图
```

---

## 7️⃣ 权限缓存优化

### 缓存策略

```typescript
// 使用 React Query 缓存权限
const { data: permission } = useQuery({
  queryKey: ReactQueryKeys.tablePermission(baseId, tableId),
  queryFn: () => getTablePermission(tableId),
  staleTime: 5 * 60 * 1000,  // 5分钟有效期
});

// 后端缓存
@Injectable()
export class PermissionService {
  @Cacheable({
    ttl: 300,  // 5分钟
    key: (userId, resourceId) => `permission:${userId}:${resourceId}`,
  })
  async getPermissionMap(userId, resourceId) {
    // ...
  }
}
```

### 权限变更通知

```typescript
// 权限变更时清除缓存并通知客户端
async updateCollaboratorRole(baseId, userId, newRole) {
  // 1. 更新数据库
  await this.prismaService.collaborator.update({...});
  
  // 2. 清除缓存
  await this.cacheService.del(`permission:${userId}:${baseId}`);
  
  // 3. 通知客户端刷新
  this.eventEmitterService.emitAsync(Events.BASE_PERMISSION_UPDATE, {
    baseId,
    userId,
  });
}

// 客户端监听
usePermissionUpdateListener(baseId, (operatorUserId) => {
  if (operatorUserId !== currentUserId) {
    toast.warning('您的权限已变更，请刷新页面');
  }
});
```

---

## 8️⃣ 企业版高级权限（EE）

### 权限矩阵

精细到**字段 × 角色**的权限控制：

```typescript
interface IAuthorityMatrix {
  [fieldId: string]: {
    [Role.Owner]: { read: true, update: true },
    [Role.Creator]: { read: true, update: true },
    [Role.Editor]: { read: true, update: false },  // 只读
    [Role.Viewer]: { read: false, update: false }, // 隐藏
  }
}
```

### 行级权限（RLS - Row Level Security）

根据条件限制记录可见性：

```typescript
// 示例：只能看到自己创建的记录
{
  filter: {
    conjunction: 'and',
    filterSet: [{
      fieldId: 'createdBy',
      operator: 'is',
      value: currentUserId,
    }]
  }
}
```

---

## 9️⃣ 权限检查性能优化

### 批量权限检查

```typescript
// ❌ 不好：N次查询
for (const record of records) {
  const canUpdate = await checkPermission(userId, record.id, 'record|update');
  if (canUpdate) {
    // ...
  }
}

// ✅ 好：1次查询
const recordIds = records.map(r => r.id);
const permissionsMap = await this.batchCheckPermissions(
  userId,
  recordIds,
  'record|update'
);

records.forEach(record => {
  if (permissionsMap[record.id]) {
    // ...
  }
});
```

### PostgreSQL RLS（企业版）

使用数据库层面的行级安全：

```sql
-- 创建策略
CREATE POLICY user_isolation_policy ON records
  FOR ALL
  USING (created_by = current_setting('app.user_id')::uuid);

-- 应用层设置上下文
SET LOCAL app.user_id = 'user-xxx';
SELECT * FROM records;  -- 自动过滤
```

---

## 🔟 实际代码示例

### 示例 1：更新记录时的权限检查

```typescript
// 前端
const permission = useTablePermission();

const handleCellEdit = (cell, newValue) => {
  // 前端预检查
  if (!permission['record|update']) {
    toast.warning('您没有权限更新记录');
    return;
  }
  
  // 调用更新
  record.updateCell(fieldId, newValue);
};

// 后端
@Permissions('record|update')  // ← 装饰器检查
@Patch(':recordId')
async updateRecord(...) {
  // 如果没权限，装饰器会自动返回 403
  
  // 检查字段级权限
  const fieldPermissions = await this.recordPermissionService.getFieldPermission(
    tableId,
    Object.keys(updateRecordRo.record.fields)
  );
  
  // 过滤不可更新的字段
  const allowedFields = Object.keys(updateRecordRo.record.fields)
    .filter(fieldId => fieldPermissions.update.includes(fieldId));
  
  if (allowedFields.length === 0) {
    throw new ForbiddenException('No permission to update any field');
  }
  
  // 执行更新
  return await this.recordOpenApiService.updateRecord(...);
}
```

### 示例 2：创建视图时的权限检查

```typescript
// 前端
const AddView = () => {
  const permission = useTablePermission();
  
  // 没权限就不显示按钮
  if (!permission['view|create']) {
    return null;
  }
  
  return (
    <Button onClick={handleCreateView}>
      <Plus /> 添加视图
    </Button>
  );
};

// 后端
@Permissions('view|create')
@Post()
async createView(
  @Param('tableId') tableId: string,
  @Body() createViewRo: ICreateViewRo
): Promise<IViewVo> {
  // 权限已通过装饰器检查
  return await this.viewOpenApiService.createView(tableId, createViewRo);
}
```

---

## 1️⃣1️⃣ 权限相关的关键文件

### 核心权限定义
| 文件 | 说明 |
|------|------|
| `packages/core/src/auth/role/types.ts` | 角色类型定义 |
| `packages/core/src/auth/role/constant.ts` | 权限矩阵（276行） |
| `packages/core/src/auth/actions.ts` | 所有权限动作定义 |
| `packages/core/src/auth/permission.ts` | 权限检查函数 |

### 前端权限使用
| 文件 | 说明 |
|------|------|
| `packages/sdk/src/hooks/use-table-permission.ts` | 表格权限 Hook |
| `packages/sdk/src/hooks/use-base-permission.ts` | Base 权限 Hook |
| `packages/sdk/src/context/table-permission/` | 权限上下文 |

### 后端权限实现
| 文件 | 说明 |
|------|------|
| `apps/nestjs-backend/src/features/auth/permission/` | 权限服务 |
| `apps/nestjs-backend/src/features/auth/decorators/` | 权限装饰器 |
| `apps/nestjs-backend/src/features/auth/guards/` | 权限守卫 |

---

## 1️⃣2️⃣ 权限决策流程图

```
HTTP 请求
    ↓
AuthGuard（认证）
    ↓
检查 JWT Token
    ↓
提取用户信息（userId, email）
    ↓
PermissionsGuard（授权）
    ↓
读取 @Permissions 装饰器
    ↓
查询用户角色
    ↓
检查角色权限表
    ↓
允许 → 执行 Controller
拒绝 → 返回 403 Forbidden
```

---

## 1️⃣3️⃣ 特殊权限场景

### 1. 字段条件权限

某些字段只在特定条件下可编辑：

```typescript
// 示例：状态字段只能从"待处理"改为"进行中"
const fieldPermission = {
  update: (oldValue, newValue, record) => {
    if (oldValue === 'pending' && newValue === 'in_progress') {
      return true;
    }
    if (record.fields['assignee'] === currentUserId) {
      return true;
    }
    return false;
  }
};
```

### 2. 视图过滤权限

基于视图过滤器的隐式权限：

```typescript
// 视图配置
{
  filter: {
    // 用户只能看到分配给自己的任务
    fieldId: 'assignee',
    operator: 'is',
    value: '{currentUserId}'  // 自动替换
  }
}
```

### 3. 协作者权限

```typescript
// 添加协作者时指定角色
await addCollaborator({
  baseId,
  userId,
  role: Role.Editor,  // 指定角色
});

// 修改协作者角色
await updateCollaborator({
  baseId,
  userId,
  role: Role.Viewer,  // 降级为查看者
});
```

---

## 1️⃣4️⃣ 安全最佳实践

### ✅ 前后端双重检查
- 前端：UI 提前禁用（用户体验）
- 后端：强制验证（安全保障）

### ✅ 最小权限原则
- 默认最小权限
- 明确授权才能操作

### ✅ 审计日志
- 记录所有权限变更
- 追溯安全问题

### ✅ 缓存失效
- 权限变更立即清除缓存
- WebSocket 实时通知客户端

---

**下一部分**：完整功能流程示例



