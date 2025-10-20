# Teable 权限矩阵功能现状分析

## ✅ 结论：权限矩阵功能 **存在但被限制为企业版功能**

---

## 🔍 功能状态

### 1. 前端实现

#### 页面路由
- **路径**：`/base/{baseId}/authority-matrix`
- **文件**：`apps/nextjs-app/src/pages/base/[baseId]/authority-matrix.tsx`
- **状态**：✅ 存在

#### 实际组件
```typescript
// apps/nextjs-app/src/features/app/blocks/AuthorityMatrix.tsx
export function AuthorityMatrixPage() {
  const { t } = useTranslation('common');
  return (
    <div className="h-full flex-col md:flex">
      <Head>
        <title>{t('noun.authorityMatrix')}</title>
      </Head>
      <div className="flex flex-col gap-2 lg:gap-4">
        <div className="items-center justify-between space-y-2 px-8 pb-2 pt-6 lg:flex">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('noun.authorityMatrix')}
          </h2>
        </div>
      </div>
      
      {/* ⚠️ 实际内容：企业版提示 */}
      <div className="flex h-full items-center justify-center p-4">
        <Alert className="w-[400px]">
          <AlertTitle>
            <span className="text-lg">✨</span> {t('billing.enterpriseFeature')}
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-3 text-xs">
            <p>{t('billing.authorityMatrixRequiresUpgrade')}</p>
            <Button className="w-fit" variant="default" asChild size="xs">
              <Link href={`${t('help.appLink')}/setting/license-plan`} target="_blank">
                {t('billing.viewPricing')}
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
```

**实现状态**：🚫 **占位页面**，显示"企业功能"升级提示

---

### 2. 侧边栏菜单

```typescript
// apps/nextjs-app/src/features/app/blocks/base/base-side-bar/BaseSideBar.tsx
const pageRoutes = [
  // ...
  {
    href: `/base/${baseId}/authority-matrix`,
    label: t('common:noun.authorityMatrix'),
    Icon: Lock,
    hidden: !basePermission?.['base|authority_matrix_config'],  // ← 权限控制
    billingLevel: BillingProductLevel.Pro,  // ← 需要 Pro 版本
  },
  // ...
];
```

**显示条件**：
1. ✅ 用户有 `base|authority_matrix_config` 权限
2. ✅ 订阅了 **Pro 级别** 或更高版本

---

### 3. 权限定义

#### 权限动作
```typescript
// packages/core/src/auth/actions.ts
export const baseActions = [
  'base|create',
  'base|delete',
  'base|read',
  'base|read_all',
  'base|update',
  'base|invite_email',
  'base|invite_link',
  'base|table_import',
  'base|table_export',
  'base|authority_matrix_config',  // ← 权限矩阵配置权限
  'base|db_connection',
  'base|query_data',
] as const;
```

#### 角色权限矩阵
```typescript
// packages/core/src/auth/role/constant.ts

// Owner（所有者）
{
  'base|authority_matrix_config': true,  // ✅ 有权限
  // ...
}

// Creator（创建者）
{
  'base|authority_matrix_config': true,  // ✅ 有权限
  // ...
}

// Editor（编辑者）
{
  'base|authority_matrix_config': false,  // ❌ 无权限
  // ...
}

// Commenter（评论者）
{
  'base|authority_matrix_config': false,  // ❌ 无权限
  // ...
}

// Viewer（查看者）
{
  'base|authority_matrix_config': false,  // ❌ 无权限
  // ...
}
```

**权限设计**：只有 **Owner** 和 **Creator** 角色才有权限配置权限矩阵

---

### 4. Base 数据结构

```typescript
// packages/openapi/src/base/get.ts
export const getBaseItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  spaceId: z.string(),
  icon: z.string().nullable(),
  role: roleSchema,
  collaboratorType: z.nativeEnum(CollaboratorType).optional(),
  restrictedAuthority: z.boolean().optional(),  // ← 标记是否启用权限限制
});
```

**`restrictedAuthority` 字段**：
- `true` - 启用了权限矩阵功能（企业版）
- `false` / `undefined` - 未启用（社区版）

---

### 5. 权限变更监听

```typescript
// apps/nextjs-app/src/features/app/blocks/base/BasePermissionListener.tsx
export const BasePermissionListener = () => {
  const baseId = useBaseId();
  const { user } = useSession();
  
  const { data: base, refetch } = useQuery({
    queryKey: ReactQueryKeys.base(baseId!),
    queryFn: ({ queryKey }) => getBaseById(queryKey[1]).then((res) => res.data),
    enabled: !!baseId,
  });

  const restrictedAuthority = base?.restrictedAuthority;  // ← 检查是否启用
  
  const onPermissionUpdate = useCallback((operatorUserId: string) => {
    if (operatorUserId !== user.id) {
      // 权限变更时刷新并提示用户
      refetch();
      toast.warning(t('base:permissionChanged'));
    }
  }, [user.id, refetch, t]);
  
  usePermissionUpdateListener(baseId, onPermissionUpdate);
  
  return null;
};
```

**功能**：监听权限变更，实时更新用户权限状态

---

## 📋 功能完整性分析

| 组件 | 状态 | 说明 |
|------|------|------|
| **前端页面** | 🟡 占位 | 存在但只显示升级提示 |
| **路由定义** | ✅ 完整 | `/base/{baseId}/authority-matrix` |
| **菜单入口** | ✅ 完整 | 侧边栏显示（需权限） |
| **权限定义** | ✅ 完整 | `base|authority_matrix_config` |
| **角色配置** | ✅ 完整 | Owner/Creator 有权限 |
| **数据字段** | ✅ 完整 | `restrictedAuthority` 标记 |
| **权限监听** | ✅ 完整 | 实时监听权限变更 |
| **实际功能** | ❌ 缺失 | 企业版独占 |

---

## 🎯 开源版本 vs 企业版

### 开源版（Community Edition）

```typescript
// ❌ 权限矩阵页面显示
<Alert>
  <AlertTitle>✨ 企业功能</AlertTitle>
  <AlertDescription>
    <p>权限矩阵需要升级到企业版</p>
    <Button>查看定价</Button>
  </AlertDescription>
</Alert>
```

**限制**：
- ✅ 菜单可见（如果有权限）
- ❌ 功能不可用
- ❌ 页面显示升级提示
- ❌ `restrictedAuthority` 为 `false`

### 企业版（Enterprise Edition / Pro）

**应该包含的功能**：
- ✅ 完整的权限矩阵配置界面
- ✅ 字段级别的权限控制
- ✅ 角色 × 字段的权限矩阵表格
- ✅ 细粒度的读写权限配置
- ✅ `restrictedAuthority` 为 `true`

---

## 💡 权限矩阵功能推测

基于代码分析，企业版的权限矩阵功能应该提供：

### 1. 字段级权限控制

```typescript
// 推测的数据结构
interface IAuthorityMatrix {
  [fieldId: string]: {
    [Role.Owner]: { read: true, update: true },
    [Role.Creator]: { read: true, update: true },
    [Role.Editor]: { read: true, update: false },  // 只读
    [Role.Viewer]: { read: false, update: false }, // 隐藏
    [Role.Commenter]: { read: true, update: false },
  }
}
```

### 2. 权限矩阵表格

| 字段 | Owner | Creator | Editor | Commenter | Viewer |
|------|-------|---------|--------|-----------|--------|
| 姓名 | 读写 | 读写 | 读写 | 只读 | 只读 |
| 薪资 | 读写 | 读写 | 只读 | 隐藏 | 隐藏 |
| 手机 | 读写 | 读写 | 只读 | 只读 | 隐藏 |

### 3. 配置界面

```typescript
// 推测的组件结构
<AuthorityMatrixConfig>
  <FieldList>
    {fields.map(field => (
      <FieldRow key={field.id}>
        <FieldName>{field.name}</FieldName>
        {roles.map(role => (
          <RolePermission 
            role={role}
            permissions={{ read, update }}
            onChange={handlePermissionChange}
          />
        ))}
      </FieldRow>
    ))}
  </FieldList>
</AuthorityMatrixConfig>
```

---

## 🔒 为什么限制为企业版？

### 商业考虑

1. **高级功能** - 字段级权限是高级企业需求
2. **差异化定价** - 区分免费版和付费版
3. **目标客户** - 面向需要精细权限控制的企业客户
4. **维护成本** - 复杂功能需要更多支持

### 技术实现

权限矩阵涉及：
- ✅ 复杂的权限计算
- ✅ 实时权限同步
- ✅ 性能优化（大量字段场景）
- ✅ UI 交互设计
- ✅ 权限冲突处理

---

## 📊 总结

### 现状
- 🟡 **半实现状态**
- ✅ 框架完整（路由、权限、数据结构）
- ❌ 核心功能缺失（配置界面）
- 🔒 **企业版独占**

### 如果需要使用
1. **购买企业版** - 官方推荐方式
2. **自行实现** - 基于现有框架开发（需要大量工作）
3. **使用替代方案** - 视图级权限 + 协作者角色控制

### 开源版可用的权限控制
虽然没有字段级权限矩阵，但 Teable 开源版仍提供：
- ✅ **5 种角色**（Owner, Creator, Editor, Commenter, Viewer）
- ✅ **50+ 权限动作**
- ✅ **视图级权限**（通过视图共享）
- ✅ **协作者管理**
- ✅ **记录级权限**（通过过滤器）

---

**建议**：如果不需要字段级别的精细权限控制，开源版的权限系统已经足够强大！




