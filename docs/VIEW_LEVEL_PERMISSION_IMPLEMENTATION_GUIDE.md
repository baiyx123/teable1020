# 实现视图级权限控制的完整方案

## 🎯 您的需求

实现 **视图级别的权限控制**，让不同用户对不同视图拥有不同权限：
- ✅ **查看权限** - 能否看到视图
- ✅ **编辑权限** - 能否编辑视图中的记录
- ✅ **导出权限** - 能否导出视图数据

---

## 📊 现状分析

### Teable 现有的视图权限功能

#### 1. 视图共享功能（已实现）

当前 Teable 有 **视图共享** 功能，可以生成分享链接：

```typescript
// packages/core/src/models/view/view.schema.ts
interface IShareViewMeta {
  password?: string;              // 访问密码
  allowCopy?: boolean;            // 允许复制
  includeHiddenField?: boolean;   // 包含隐藏字段
  includeRecords?: boolean;       // 包含记录数据
  submit?: {                      // 表单提交设置
    allow?: boolean;
    requireLogin?: boolean;
  };
}
```

**限制**：
- ❌ 只能通过匿名链接分享
- ❌ 不能授权给特定用户
- ❌ 权限粒度有限
- ❌ 无法控制编辑/导出权限

---

## 💡 实现方案

### 方案 1：基于角色的视图权限（推荐 ⭐）

最符合 Teable 现有架构的方案。

#### 数据库设计

```sql
-- 视图协作者表（新增）
CREATE TABLE view_collaborator (
  id VARCHAR(20) PRIMARY KEY,
  view_id VARCHAR(20) NOT NULL,
  user_id VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL,  -- 'editor' | 'viewer' | 'exporter'
  created_by VARCHAR(20),
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(view_id, user_id),
  FOREIGN KEY (view_id) REFERENCES view(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE INDEX idx_view_collaborator_view ON view_collaborator(view_id);
CREATE INDEX idx_view_collaborator_user ON view_collaborator(user_id);
```

#### 权限角色定义（复用现有角色体系 ⭐）

Teable 现有的5个角色：**Owner > Creator > Editor > Commenter > Viewer**

```typescript
// packages/core/src/auth/role/view.ts
import { Role } from './types';

// 视图级别可用的角色（复用现有 Role 枚举）
export const ViewRole = {
  Owner: Role.Owner,           // 视图所有者
  Creator: Role.Creator,       // 创建者
  Editor: Role.Editor,         // 编辑者
  Commenter: Role.Commenter,   // 评论者
  Viewer: Role.Viewer,         // 查看者
} as const;

export type IViewRole = typeof Role;

// 视图级别的权限映射
export const ViewRolePermissions: Record<IViewRole, Record<string, boolean>> = {
  [Role.Owner]: {
    // 视图管理权限
    'view|read': true,
    'view|update': true,
    'view|delete': true,
    'view|share': true,
    'view|invite': true,        // 可以邀请协作者
    'view|grant_role': true,    // 可以授予角色
    
    // 记录操作权限
    'view_record|read': true,
    'view_record|create': true,
    'view_record|update': true,
    'view_record|delete': true,
    'view_record|comment': true,
    
    // 数据导出权限
    'view_data|export': true,
  },
  
  [Role.Creator]: {
    // 视图管理权限
    'view|read': true,
    'view|update': true,         // 可以修改视图设置（排序、筛选等）
    'view|delete': false,
    'view|share': true,
    'view|invite': true,         // 可以邀请协作者
    'view|grant_role': false,    // 不能授予角色
    
    // 记录操作权限
    'view_record|read': true,
    'view_record|create': true,
    'view_record|update': true,
    'view_record|delete': true,
    'view_record|comment': true,
    
    // 数据导出权限
    'view_data|export': true,
  },
  
  [Role.Editor]: {
    // 视图管理权限
    'view|read': true,
    'view|update': false,        // 不能修改视图设置
    'view|delete': false,
    'view|share': false,
    'view|invite': false,
    'view|grant_role': false,
    
    // 记录操作权限
    'view_record|read': true,
    'view_record|create': true,
    'view_record|update': true,
    'view_record|delete': true,
    'view_record|comment': true,
    
    // 数据导出权限
    'view_data|export': true,    // Editor 可以导出
  },
  
  [Role.Commenter]: {
    // 视图管理权限
    'view|read': true,
    'view|update': false,
    'view|delete': false,
    'view|share': false,
    'view|invite': false,
    'view|grant_role': false,
    
    // 记录操作权限
    'view_record|read': true,
    'view_record|create': false,
    'view_record|update': false,
    'view_record|delete': false,
    'view_record|comment': true,  // 只能评论
    
    // 数据导出权限
    'view_data|export': true,     // Commenter 可以导出
  },
  
  [Role.Viewer]: {
    // 视图管理权限
    'view|read': true,
    'view|update': false,
    'view|delete': false,
    'view|share': false,
    'view|invite': false,
    'view|grant_role': false,
    
    // 记录操作权限
    'view_record|read': true,
    'view_record|create': false,
    'view_record|update': false,
    'view_record|delete': false,
    'view_record|comment': false,
    
    // 数据导出权限
    'view_data|export': true,     // Viewer 可以导出（与 Base 权限一致）
  },
};
```

**说明**：
- ✅ **完全复用现有 `Role` 枚举** - 不创建新的角色类型
- ✅ **权限定义与 Base/Space 保持一致** - 同样的角色名称，类似的权限层级
- ✅ **导出权限默认开启** - 与现有 Base 权限保持一致（Editor/Commenter/Viewer 都可导出）
- ⚠️ **如需限制导出**，可单独设置为 `false`

#### 后端 API 实现

```typescript
// apps/nestjs-backend/src/features/view-collaborator/view-collaborator.service.ts
@Injectable()
export class ViewCollaboratorService {
  
  // 添加视图协作者
  async addViewCollaborator(
    viewId: string,
    userId: string,
    role: IRole  // 使用现有的 Role 类型
  ) {
    // 1. 检查当前用户是否有权限邀请
    const currentUser = this.cls.get('user.id');
    const currentUserRole = await this.getViewRole(viewId, currentUser);
    
    if (currentUserRole !== ViewRole.Owner) {
      throw new ForbiddenException('Only view owner can add collaborators');
    }
    
    // 2. 创建协作者
    return await this.prismaService.viewCollaborator.create({
      data: {
        id: generateViewCollaboratorId(),
        viewId,
        userId,
        role,
        createdBy: currentUser,
      },
    });
  }
  
  // 获取用户在视图上的角色
  async getViewRole(viewId: string, userId: string): Promise<IRole | null> {
    // 1. 检查是否是视图创建者（Owner）
    const view = await this.prismaService.view.findUnique({
      where: { id: viewId },
      include: { table: { select: { baseId: true } } },
    });
    if (view?.createdBy === userId) {
      return Role.Owner;
    }
    
    // 2. 检查视图协作者表
    const collaborator = await this.prismaService.viewCollaborator.findUnique({
      where: { viewId_userId: { viewId, userId } },
    });
    if (collaborator) {
      return collaborator.role as IRole;
    }
    
    // 3. 继承 Base 级别权限（降级到视图级别）
    const baseRole = await this.basePermissionService.getUserBaseRole(
      view.table.baseId,
      userId
    );
    
    if (baseRole) {
      // 继承 Base 角色，但不超过 Viewer（视图级别的最低权限）
      // 如果 Base 是 Owner/Creator/Editor，视图默认给 Viewer
      // 这样用户可以看到视图，但需要被明确授权才能编辑
      return Role.Viewer;
    }
    
    return null; // 无权限
  }
  
  // 获取用户视图权限
  async getViewPermissions(viewId: string, userId: string) {
    const role = await this.getViewRole(viewId, userId);
    if (!role) {
      return {}; // 无权限
    }
    return ViewRolePermissions[role];
  }
  
  // 获取视图的所有协作者
  async getViewCollaborators(viewId: string) {
    return await this.prismaService.viewCollaborator.findMany({
      where: { viewId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }
  
  // 更新协作者角色
  async updateViewCollaborator(
    viewId: string,
    userId: string,
    role: IRole
  ) {
    const currentUser = this.cls.get('user.id');
    const currentUserRole = await this.getViewRole(viewId, currentUser);
    
    if (currentUserRole !== ViewRole.Owner) {
      throw new ForbiddenException('Only view owner can update collaborators');
    }
    
    return await this.prismaService.viewCollaborator.update({
      where: { viewId_userId: { viewId, userId } },
      data: { role },
    });
  }
  
  // 移除协作者
  async removeViewCollaborator(viewId: string, userId: string) {
    const currentUser = this.cls.get('user.id');
    const currentUserRole = await this.getViewRole(viewId, currentUser);
    
    if (currentUserRole !== ViewRole.Owner) {
      throw new ForbiddenException('Only view owner can remove collaborators');
    }
    
    return await this.prismaService.viewCollaborator.delete({
      where: { viewId_userId: { viewId, userId } },
    });
  }
}
```

#### 权限装饰器

```typescript
// apps/nestjs-backend/src/features/view-collaborator/decorators/view-permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const VIEW_PERMISSIONS_KEY = 'viewPermissions';

export const ViewPermissions = (...permissions: string[]) =>
  SetMetadata(VIEW_PERMISSIONS_KEY, permissions);

// 使用示例
@ViewPermissions('view_record|update')
@Patch(':viewId/record/:recordId')
async updateRecordInView(...) {
  // 只有 Owner 和 Editor 可以访问
}

@ViewPermissions('view_data|export')
@Get(':viewId/export')
async exportViewData(...) {
  // 只有 Owner 和 Exporter 可以访问
}
```

#### 权限 Guard

```typescript
// apps/nestjs-backend/src/features/view-collaborator/guards/view-permissions.guard.ts
@Injectable()
export class ViewPermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly viewCollaboratorService: ViewCollaboratorService,
    private readonly cls: ClsService<IClsStore>
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      VIEW_PERMISSIONS_KEY,
      context.getHandler()
    );
    
    if (!requiredPermissions) {
      return true; // 没有权限要求
    }
    
    const request = context.switchToHttp().getRequest();
    const viewId = request.params.viewId;
    const userId = this.cls.get('user.id');
    
    // 获取用户视图权限
    const permissions = await this.viewCollaboratorService.getViewPermissions(
      viewId,
      userId
    );
    
    // 检查是否拥有所需权限
    return requiredPermissions.every((perm) => permissions[perm]);
  }
}
```

#### Controller 示例

```typescript
// apps/nestjs-backend/src/features/view/open-api/view-open-api.controller.ts
@Controller('api/table/:tableId/view')
@UseGuards(ViewPermissionsGuard)
export class ViewOpenApiController {
  
  // 获取视图协作者
  @ViewPermissions('view|read')
  @Get(':viewId/collaborators')
  async getViewCollaborators(@Param('viewId') viewId: string) {
    return await this.viewCollaboratorService.getViewCollaborators(viewId);
  }
  
  // 添加视图协作者
  @ViewPermissions('view|invite')
  @Post(':viewId/collaborators')
  async addViewCollaborator(
    @Param('viewId') viewId: string,
    @Body() body: { userId: string; role: IRole }
  ) {
    return await this.viewCollaboratorService.addViewCollaborator(
      viewId,
      body.userId,
      body.role
    );
  }
  
  // 更新记录（需要编辑权限）
  @ViewPermissions('view_record|update')
  @Patch(':viewId/record/:recordId')
  async updateRecordInView(
    @Param('viewId') viewId: string,
    @Param('recordId') recordId: string,
    @Body() updateRecordRo: IUpdateRecordRo
  ) {
    // 实际调用 recordService
    return await this.recordService.updateRecord(...);
  }
  
  // 导出数据（需要导出权限）
  @ViewPermissions('view_data|export')
  @Get(':viewId/export')
  async exportViewData(@Param('viewId') viewId: string) {
    return await this.viewExportService.exportView(viewId);
  }
}
```

---

### 前端实现

#### 视图协作者管理组件（复用现有组件结构）

```typescript
// apps/nextjs-app/src/features/app/components/view-collaborator/ViewCollaboratorModal.tsx
import { Role } from '@teable/core';
import { useRoleStatic } from '../collaborator-manage/useRoleStatic';
import { RoleSelect } from '../collaborator-manage/components/RoleSelect';

export const ViewCollaboratorModal = ({ viewId }: { viewId: string }) => {
  const { t } = useTranslation('common');
  const roleStatic = useRoleStatic(); // 复用现有的角色静态数据
  const [role, setRole] = useState<IRole>(Role.Viewer);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const { data: collaborators } = useQuery({
    queryKey: ['view-collaborators', viewId],
    queryFn: () => getViewCollaborators(viewId),
  });
  
  const { mutate: addCollaborator } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: IRole }) =>
      addViewCollaborator(viewId, { userId, role }),
    onSuccess: () => {
      toast.success(t('collaborator.addSuccess'));
      queryClient.invalidateQueries(['view-collaborators', viewId]);
    },
  });
  
  // 过滤出适合视图的角色（不包括 Owner，因为 Owner 是创建者）
  const viewRoleOptions = useMemo(() => 
    roleStatic.filter(r => r.role !== Role.Owner),
    [roleStatic]
  );
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('viewCollaborator.title')}</DialogTitle>
          <DialogDescription>
            {t('viewCollaborator.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 现有协作者列表 */}
          <div>
            <h3 className="font-medium mb-3">{t('collaborator.existing')}</h3>
            <div className="space-y-2">
              {collaborators?.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={c.user} />
                    <div>
                      <div className="font-medium">{c.user.name}</div>
                      <div className="text-xs text-muted-foreground">{c.user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* 复用现有的 RoleSelect 组件 */}
                    <RoleSelect
                      value={c.role}
                      options={viewRoleOptions}
                      onChange={(role) => updateCollaborator(viewId, c.userId, role)}
                    />
                    
                    {c.role !== Role.Owner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCollaborator(viewId, c.userId)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 添加新协作者 */}
          <div>
            <h3 className="font-medium mb-3">{t('collaborator.add')}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <UserSelector
                  className="flex-1"
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  placeholder={t('collaborator.selectUser')}
                />
                <RoleSelect
                  value={role}
                  options={viewRoleOptions}
                  onChange={setRole}
                />
              </div>
              
              <Button
                className="w-full"
                disabled={selectedUsers.length === 0}
                onClick={() => {
                  selectedUsers.forEach((userId) => {
                    addCollaborator({ userId, role });
                  });
                  setSelectedUsers([]);
                }}
              >
                <UserPlus className="mr-2 size-4" />
                {t('collaborator.addButton')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

**关键点**：
- ✅ 复用 `useRoleStatic()` - 获取角色的名称和描述
- ✅ 复用 `RoleSelect` 组件 - UI 样式完全一致
- ✅ 复用 `UserAvatar` 等基础组件
- ✅ 使用相同的 `Role` 枚举

#### 视图权限 Hook

```typescript
// packages/sdk/src/hooks/use-view-permission.ts
export const useViewPermission = (viewId?: string) => {
  const { user } = useSession();
  
  const { data: permissions } = useQuery({
    queryKey: ReactQueryKeys.viewPermission(viewId!),
    queryFn: () => getViewPermissions(viewId!).then((res) => res.data),
    enabled: !!viewId && !!user,
  });
  
  return permissions || {};
};

// 使用示例
const ViewHeader = () => {
  const viewId = useViewId();
  const permission = useViewPermission(viewId);
  
  return (
    <div>
      {/* 只有有编辑权限的用户才能看到添加记录按钮 */}
      {permission['view_record|create'] && (
        <Button onClick={handleAddRecord}>
          <Plus /> 添加记录
        </Button>
      )}
      
      {/* 只有有导出权限的用户才能看到导出按钮 */}
      {permission['view_data|export'] && (
        <Button onClick={handleExport}>
          <Download /> 导出
        </Button>
      )}
    </div>
  );
};
```

---

## 📊 方案对比

### 方案 1：视图协作者（推荐）✅

**优点**：
- ✅ 与现有 Base/Space 协作者架构一致
- ✅ 灵活的角色权限控制
- ✅ 支持细粒度权限（查看、编辑、导出）
- ✅ 易于扩展新权限
- ✅ 权限清晰明确

**缺点**：
- ⚠️ 需要新增数据表
- ⚠️ 需要修改前后端代码

### 方案 2：扩展视图共享元数据

**思路**：在现有的 `shareMeta` 基础上扩展

```typescript
interface IShareViewMeta {
  // 现有字段
  password?: string;
  allowCopy?: boolean;
  includeRecords?: boolean;
  
  // 新增字段
  allowedUsers?: {
    userId: string;
    canEdit?: boolean;
    canExport?: boolean;
  }[];
}
```

**优点**：
- ✅ 不需要新表
- ✅ 实现简单

**缺点**：
- ❌ 数据结构不清晰
- ❌ 查询性能差（JSON 字段）
- ❌ 不符合关系型数据库设计
- ❌ 难以扩展

---

## 🚀 实施步骤

### Phase 1: 数据库和基础服务（1-2天）

1. ✅ 创建数据库迁移文件
2. ✅ 创建 ViewCollaborator 模型
3. ✅ 实现 ViewCollaboratorService
4. ✅ 定义权限角色和权限映射

### Phase 2: 后端 API（2-3天）

1. ✅ 实现权限装饰器和 Guard
2. ✅ 创建 API 端点
   - `GET /view/:viewId/collaborators` - 获取协作者
   - `POST /view/:viewId/collaborators` - 添加协作者
   - `PATCH /view/:viewId/collaborators/:userId` - 更新角色
   - `DELETE /view/:viewId/collaborators/:userId` - 移除协作者
   - `GET /view/:viewId/permissions` - 获取当前用户权限
3. ✅ 在现有 API 上添加权限检查
   - Record CRUD APIs
   - Export API
   - View update API

### Phase 3: 前端实现（3-4天）

1. ✅ 创建 API 客户端函数
2. ✅ 实现视图协作者管理组件
3. ✅ 实现 useViewPermission Hook
4. ✅ 在 UI 上添加权限控制
   - 隐藏/禁用无权限的按钮
   - 添加"管理协作者"入口
5. ✅ 添加权限提示

### Phase 4: 测试和优化（1-2天）

1. ✅ 单元测试
2. ✅ 集成测试
3. ✅ 性能优化（缓存权限查询）
4. ✅ 用户文档

**总计：7-11 天**

---

## 📝 核心代码清单

### 需要创建的文件

```
后端：
├── prisma/migrations/xxx_add_view_collaborator.sql
├── packages/core/src/auth/role/view-role.ts
├── apps/nestjs-backend/src/features/view-collaborator/
│   ├── view-collaborator.module.ts
│   ├── view-collaborator.service.ts
│   ├── view-collaborator.controller.ts
│   ├── decorators/view-permissions.decorator.ts
│   ├── guards/view-permissions.guard.ts
│   └── dto/

前端：
├── packages/openapi/src/view/
│   ├── add-collaborator.ts
│   ├── get-collaborators.ts
│   ├── update-collaborator.ts
│   ├── remove-collaborator.ts
│   └── get-permissions.ts
├── packages/sdk/src/hooks/
│   └── use-view-permission.ts
├── apps/nextjs-app/src/features/app/components/view-collaborator/
│   ├── ViewCollaboratorModal.tsx
│   ├── ViewCollaboratorList.tsx
│   └── ViewRoleSelect.tsx
```

---

## 💡 使用示例

### 场景 1：只读访问 - Viewer

```typescript
// 适用于只需查看数据的用户
await addViewCollaborator('viwXXX', 'usrYYY', Role.Viewer);

// Viewer 可以：
✅ 查看视图
✅ 查看所有记录
✅ 导出数据（Excel/CSV）
❌ 编辑记录
❌ 添加评论
❌ 修改视图设置
```

### 场景 2：评论权限 - Commenter

```typescript
// 适用于需要反馈但不能编辑的审核人员
await addViewCollaborator('viwXXX', 'reviewerUserId', Role.Commenter);

// Commenter 可以：
✅ 查看视图
✅ 查看记录
✅ 添加评论（提供反馈）
✅ 导出数据
❌ 编辑记录
❌ 修改视图设置
```

### 场景 3：编辑记录 - Editor

```typescript
// 适用于需要维护数据的团队成员
await addViewCollaborator('viwXXX', 'editorUserId', Role.Editor);

// Editor 可以：
✅ 查看视图
✅ 创建记录
✅ 编辑记录
✅ 删除记录
✅ 添加评论
✅ 导出数据
❌ 修改视图设置（排序、筛选等）
❌ 邀请其他协作者
```

### 场景 4：管理视图 - Creator

```typescript
// 适用于需要配置视图的高级用户
await addViewCollaborator('viwXXX', 'adminUserId', Role.Creator);

// Creator 可以：
✅ 查看视图
✅ 编辑记录
✅ 修改视图设置（排序、筛选、分组、隐藏字段等）
✅ 分享视图
✅ 邀请其他协作者
✅ 导出数据
❌ 删除视图（仅 Owner 可以）
❌ 授予 Owner 角色
```

### 场景 5：完全控制 - Owner

```typescript
// Owner 是视图的创建者，自动拥有所有权限
const view = await createView(...);
// view.createdBy 自动成为 Owner

// Owner 可以：
✅ 所有权限
✅ 删除视图
✅ 转移所有权
✅ 管理所有协作者
```

---

## 🔒 安全考虑

### 1. 权限降级原则
```
视图权限 < Base 权限 < Space 权限
```
取最小权限。例如：
- Base 是 Viewer（只读）
- 视图给了 Editor（编辑）
- **实际权限：Viewer**（取最小）

### 2. 权限缓存
```typescript
// 使用 Redis 缓存用户视图权限（5分钟）
const cacheKey = `view:${viewId}:user:${userId}:permissions`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const permissions = await this.calculatePermissions(viewId, userId);
await redis.setex(cacheKey, 300, JSON.stringify(permissions));
return permissions;
```

### 3. 权限变更通知
```typescript
// 权限变更时，通过 WebSocket 通知用户
this.eventEmitter.emit('view.collaborator.updated', {
  viewId,
  userId,
  newRole,
});

// 前端监听
useViewPermissionUpdateListener(viewId, () => {
  toast.warning('您的视图权限已变更');
  queryClient.invalidateQueries(['view-permission', viewId]);
});
```

---

## ✅ 总结

这个方案：
1. ✅ **完全实现您的需求** - 视图级别的查看、编辑、导出权限控制
2. ✅ **与现有架构一致** - 参考 Base/Space 协作者模式
3. ✅ **灵活可扩展** - 可以轻松添加新角色和权限
4. ✅ **安全可靠** - 前后端双重验证
5. ✅ **用户友好** - 清晰的角色定义和 UI

您想从哪个部分开始实现？我可以提供更详细的代码示例！🚀


