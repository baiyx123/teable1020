# Teable 权限分配机制详解

## ✅ 答案：是的！开源版的权限是在分享给协作者时提供的

权限分配发生在 **邀请协作者** 或 **分享链接** 时，通过选择 **角色（Role）** 来决定。

---

## 🎯 权限分配流程

### 1. 邀请入口

在 Teable 中，有多个地方可以邀请协作者：

#### 表格页面
```tsx
// apps/nextjs-app/src/features/app/blocks/table/table-header/TableHeader.tsx
<BaseCollaboratorModalTrigger
  base={{
    name: base.name,
    role: base.role,
    id: base.id,
  }}
>
  <Button variant="default" size="xs">
    <UserPlus className="size-4" /> {t('space:action.invite')}
  </Button>
</BaseCollaboratorModalTrigger>
```

#### Space 设置页面
```tsx
// apps/nextjs-app/src/features/app/blocks/space-setting/collaborator/CollaboratorPage.tsx
<SpaceCollaboratorModalTrigger space={space}>
  <Button size="sm">
    <UserPlus className="size-4" /> {t('space:action.invite')}
  </Button>
</SpaceCollaboratorModalTrigger>
```

---

### 2. 协作者添加界面

核心组件：`CollaboratorAdd`

```typescript
// apps/nextjs-app/src/features/app/components/collaborator-manage/components/CollaboratorAdd.tsx

export const CollaboratorAdd = (props: ICollaboratorAddProps) => {
  const { resourceId, resourceType, currentRole, onConfirm } = props;
  
  // ✅ 默认角色选择
  const [role, setRole] = useState<IRole>(() =>
    isBase && currentRole === Role.Owner 
      ? Role.Creator  // Owner 邀请时默认为 Creator
      : currentRole   // 其他角色邀请时默认为自己的角色
  );
  
  // ✅ 可选择的角色范围（只能选择权限≤自己的角色）
  const filteredRoleStatic = useFilteredRoleStatic(currentRole);
  
  return (
    <div>
      {/* 角色选择器 */}
      <RoleSelect
        value={role}
        onChange={setRole}
        options={isBase ? filteredBaseRoleStatic : filteredRoleStatic}
      />
      
      {/* 添加按钮 */}
      <Button onClick={() => {
        addCollaborators(
          selectedMembers.map((m) => ({
            principalId: m.id,
            principalType: m.type === MemberSelectorNodeType.USER
              ? PrincipalType.User
              : PrincipalType.Department,
          }))
        );
      }}>
        {t('common:actions.add')}
      </Button>
    </div>
  );
};
```

---

### 3. 角色选择器

```typescript
// apps/nextjs-app/src/features/app/components/collaborator-manage/components/RoleSelect.tsx

export const RoleSelect = (props: IRoleSelect) => {
  const { value, options, onChange } = props;
  
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange?.(value as IRole)}
    >
      <SelectTrigger className="h-8 w-32">
        <SelectValue>{showSelectedRoleValue}</SelectValue>
      </SelectTrigger>
      <SelectContent className="w-72">
        {options.map(({ role, name, description }) => (
          <SelectItem key={role} value={role}>
            <span className="text-sm">{name}</span>
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
```

---

### 4. 角色过滤规则

**重要规则**：用户只能邀请 **权限等级 ≤ 自己** 的协作者

```typescript
// apps/nextjs-app/src/features/app/components/collaborator-manage/utils.ts

export const getRolesWithLowerPermissions = (
  role: IRole,
  roleStatic: IRoleStatic[],
  includeRole: boolean = true
) => {
  const roleLevel = roleStatic.find((item) => item.role === role)?.level;
  if (roleLevel == undefined) {
    return [];
  }
  return roleStatic.filter(({ level }) => 
    includeRole ? level >= roleLevel : level > roleLevel
  );
};
```

**角色等级**（level 越小权限越高）：
```
Owner     → level 1 (最高)
Creator   → level 2
Editor    → level 3
Commenter → level 4
Viewer    → level 5 (最低)
```

---

### 5. 角色选择矩阵

| 邀请者角色 | 可以邀请的角色 | 说明 |
|-----------|---------------|------|
| **Owner** | Creator, Editor, Commenter, Viewer | ❌ 不能邀请 Owner <br> ✅ Base 中 Owner 邀请默认为 Creator |
| **Creator** | Creator, Editor, Commenter, Viewer | ✅ 可以邀请同级或更低权限 |
| **Editor** | Editor, Commenter, Viewer | ✅ 可以邀请同级或更低权限 |
| **Commenter** | Commenter, Viewer | ✅ 可以邀请同级或更低权限 |
| **Viewer** | Viewer | ✅ 只能邀请同级 |

---

### 6. 后端 API 调用

```typescript
// 调用添加协作者 API
const { mutate: addCollaborators } = useMutation({
  mutationFn: async (collaborators: IAddCollaborator[]) => {
    if (isBase) {
      // Base 级别
      await addBaseCollaborator(resourceId, {
        collaborators: userCollaborators,
        role: role as IBaseRole,  // ← 选择的角色
      });
    } else {
      // Space 级别
      await addSpaceCollaborator(resourceId, {
        collaborators: userCollaborators,
        role: role as IRole,  // ← 选择的角色
      });
    }
  },
});
```

---

### 7. 后端验证

```typescript
// apps/nestjs-backend/src/features/collaborator/collaborator.service.ts

async addBaseCollaborators(baseId: string, collaborator: AddBaseCollaboratorRo) {
  // ✅ 验证邀请者是否有权限添加该角色
  await this.validateUserAddRole({
    userId: this.cls.get('user.id'),
    addRole: collaborator.role,  // ← 要添加的角色
    resourceId: baseId,
    resourceType: CollaboratorType.Base,
  });
  
  // ✅ 创建协作者
  return this.createBaseCollaborator({
    collaborators: collaborator.collaborators,
    baseId,
    role: collaborator.role,  // ← 分配的角色
    createdBy: this.cls.get('user.id'),
  });
}

async validateUserAddRole({
  userId,
  addRole,
  resourceId,
  resourceType,
}: {
  userId: string;
  addRole: IRole;
  resourceId: string;
  resourceType: CollaboratorType;
}) {
  // 获取当前用户的角色
  const userRole = await this.getUserRole(...);
  
  // ✅ 检查是否有权限添加该角色
  if (!canManageRole(userRole, addRole)) {
    throw new ForbiddenException(
      'You do not have permission to add this role'
    );
  }
}
```

---

## 📊 完整流程图

```
┌────────────────────────────────────────────────────────┐
│ 1. 用户点击"邀请"按钮                                    │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 2. 打开协作者邀请对话框                                  │
│    - 选择成员（用户/部门）                               │
│    - 选择角色（下拉框）                                  │
│      └→ 只显示权限 ≤ 自己的角色                         │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 3. 角色选择示例                                          │
│                                                          │
│   当前用户：Owner                                        │
│   可选角色：                                             │
│   ┌─────────────────────────────┐                       │
│   │ ✓ Creator      (创建者)      │                       │
│   │   可以创建表格和字段           │                       │
│   ├─────────────────────────────┤                       │
│   │ ✓ Editor       (编辑者)      │                       │
│   │   可以编辑记录                │                       │
│   ├─────────────────────────────┤                       │
│   │ ✓ Commenter    (评论者)      │                       │
│   │   只能查看和评论              │                       │
│   ├─────────────────────────────┤                       │
│   │ ✓ Viewer       (查看者)      │                       │
│   │   只能查看                    │                       │
│   └─────────────────────────────┘                       │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 4. 用户选择角色：Editor                                  │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 5. 点击"添加"按钮                                        │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 6. 前端发送 API 请求                                     │
│    POST /api/base/{baseId}/collaborator                 │
│    Body: {                                               │
│      collaborators: [                                    │
│        { principalId: 'usrXXX', principalType: 'user' }  │
│      ],                                                  │
│      role: 'editor'  ← 选择的角色                        │
│    }                                                     │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 7. 后端处理                                              │
│    ✅ 验证邀请者权限                                     │
│    ✅ 验证被邀请者是否存在                               │
│    ✅ 检查是否已经是协作者                               │
│    ✅ 创建协作者记录（分配 Editor 角色）                  │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 8. 数据库保存                                            │
│    INSERT INTO collaborator (                            │
│      base_id,                                            │
│      user_id,                                            │
│      role_id,        ← 'editor'                         │
│      created_by                                          │
│    )                                                     │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 9. 被邀请者获得权限                                      │
│    ✅ Editor 角色的所有权限                              │
│       - record|read      ✅                              │
│       - record|create    ✅                              │
│       - record|update    ✅                              │
│       - record|delete    ✅                              │
│       - field|read       ✅                              │
│       - field|create     ❌                              │
│       - field|update     ❌                              │
│       - table|create     ❌                              │
│       - ... (50+ 权限)                                   │
└────────────────────────────────────────────────────────┘
                    ↓
┌────────────────────────────────────────────────────────┐
│ 10. 前端权限生效                                         │
│     被邀请者访问 Base 时：                                │
│     - useBasePermission() 返回 Editor 的权限 Map         │
│     - UI 根据权限显示/隐藏功能                           │
│     - API 请求自动附加权限检查                           │
└────────────────────────────────────────────────────────┘
```

---

## 🔑 关键点总结

### 1. 权限来源
✅ **协作者邀请时分配**
- Space 级别协作者
- Base 级别协作者

### 2. 角色 = 权限包
每个角色对应一组预定义的权限（50+ 个）

```typescript
// packages/core/src/auth/role/constant.ts
[Role.Editor]: {
  'space|read': true,
  'base|read': true,
  'table|read': true,
  'table|create': false,  // ❌ Editor 不能创建表
  'field|read': true,
  'field|create': false,  // ❌ Editor 不能创建字段
  'record|read': true,
  'record|create': true,
  'record|update': true,
  'record|delete': true,
  'record|comment': true,
  // ... 50+ 权限
}
```

### 3. 权限层级
- **Space 权限** → 自动继承到所有 Base
- **Base 权限** → 自动继承到所有 Table
- **取最小权限** - 如果 Space 是 Viewer，Base 是 Owner，实际为 Viewer

### 4. 动态权限检查
```typescript
// 前端实时检查
const permission = useBasePermission();

// 渲染时检查
{permission['table|create'] && <CreateTableButton />}

// API 调用时检查
@Permissions('record|update')
async updateRecord() { }
```

---

## 🎯 开源版 vs 企业版权限对比

| 特性 | 开源版 | 企业版 |
|------|--------|--------|
| **角色系统** | ✅ 5 种角色 | ✅ 5 种角色 |
| **50+ 权限动作** | ✅ 完整支持 | ✅ 完整支持 |
| **协作者邀请** | ✅ 完整支持 | ✅ 完整支持 |
| **角色分配** | ✅ 邀请时选择 | ✅ 邀请时选择 |
| **权限继承** | ✅ Space → Base → Table | ✅ Space → Base → Table |
| **视图共享** | ✅ 支持 | ✅ 支持 |
| **字段级权限矩阵** | ❌ 不支持 | ✅ 支持（需 Pro） |
| **行级权限（RLS）** | ❌ 不支持 | ✅ 支持（需 Enterprise） |

---

## 💡 实际使用示例

### 示例 1：邀请同事为 Editor

```
1. 作为 Owner，点击"邀请"
2. 输入同事邮箱：colleague@company.com
3. 选择角色：Editor
4. 点击"发送邀请"

✅ 同事收到邀请邮件，接受后获得 Editor 权限：
   - 可以查看所有数据
   - 可以添加、编辑、删除记录
   - 可以评论
   - ❌ 不能创建表格
   - ❌ 不能修改字段
```

### 示例 2：邀请客户为 Viewer

```
1. 作为 Creator，点击"邀请"
2. 输入客户邮箱：client@customer.com
3. 选择角色：Viewer
4. 点击"发送邀请"

✅ 客户获得 Viewer 权限：
   - ✅ 可以查看所有数据
   - ❌ 不能编辑任何内容
   - ❌ 不能评论
   - ❌ 不能创建记录
```

---

## 🔒 安全机制

### 1. 前端限制
- UI 根据权限显示/隐藏按钮
- 防止误操作

### 2. 后端强制验证
- 每个 API 都有 `@Permissions` 装饰器
- 即使前端绕过，后端也会拒绝

### 3. 角色管理限制
- 只能邀请权限 ≤ 自己的角色
- 防止权限提升攻击

---

## ✅ 结论

**是的！** 开源版的权限完全是通过 **邀请协作者时选择角色** 来分配的：

1. ✅ 邀请时选择 5 种角色之一
2. ✅ 每个角色对应一组预定义权限（50+）
3. ✅ 权限立即生效，实时同步
4. ✅ 前后端双重验证，确保安全

虽然没有企业版的 **字段级权限矩阵**，但开源版的角色权限系统已经非常强大和灵活！🎉



