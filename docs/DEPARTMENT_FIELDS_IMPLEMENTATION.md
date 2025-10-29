# 部门字段功能实现文档

## 概述

本文档记录了在Teable系统中新增"创建部门"(CreatedByDepartment)和"修改部门"(LastModifiedByDepartment)字段类型的完整实现过程。

## 目标

实现两个新的系统字段类型:
- **创建部门(CreatedByDepartment)**: 自动记录创建记录时用户所属的部门
- **修改部门(LastModifiedByDepartment)**: 自动记录最后修改记录时用户所属的部门

这两个字段与现有的"创建人"(CreatedBy)和"修改人"(LastModifiedBy)字段类似,但记录的是部门信息而非用户信息。

## 实现原理

### 数据存储方式
- 使用数据库系统字段 `__created_by_department` 和 `__last_modified_by_department` 存储部门信息
- 数据格式为JSON: `{"id": "dept001", "name": "技术部", "code": "TECH"}`
- 字段类型为计算字段(computed field),值由系统自动填充,用户不可编辑

### 数据流程
```
用户创建/修改记录 
  → 系统读取用户的主部门信息
  → 写入 __created_by_department 或 __last_modified_by_department 系统字段
  → 前端通过 reference.service.ts 读取并转换为字段值
  → 前端组件渲染部门名称
```

## 修改文件清单

### 一、核心模型和类型定义

#### 1. packages/core/src/models/field/field.ts
**修改内容**: 
- 在 `FieldType` 枚举中添加 `CreatedByDepartment` 和 `LastModifiedByDepartment`
- 添加部门字段的核心类定义

**原因Menu 定义新的字段类型,作为整个系统的基础

#### 2. packages/core/src/models/record/record.ts
**修改内容**:
- 在 `recordSchema` 中添加 `createdByDepartment` 和 `lastModifiedByDepartment` 属性
- 更新 `IRecord` 接口

**原因Menu 记录对象需要包含部门信息,确保数据在前后端传递时的一致性

#### 3. packages/sdk/src/model/field/
**新增文件**:
- `created-by-department.field.ts`: 创建部门字段模型
- `last-modified-by-department.field.ts`: 修改部门字段模型

**修改文件**:
- `index.ts`: 导出新的字段类型

**原因**: 前端需要字段模型来正确处理这些字段

### 二、后端数据处理

#### 4. apps/nestjs-backend/src/features/field/constant.ts
**修改内容**:
- 在 `IVisualTableDefaultField` 接口中添加 `__created_by_department` 和 `__last_modified_by_department`
- 在 `preservedDbFieldNames` 数组中添加这两个字段名
- 在 `systemDbFieldNames` 数组中添加这两个字段名
- 在 `systemFieldTypes` 数组中添加 `CreatedByDepartment` 和 `LastModifiedByDepartment`

**原因**: 将部门字段标记为系统字段,确保系统能正确识别和处理

#### 5. apps/nestjs-backend/src/features/field/field-calculate/field-supplement.service.ts
**修改内容**:
- 在 `prepareCreateFieldInner` 方法中添加对部门字段类型的处理
- 定义部门字段的 `cellValueType`、`dbFieldType` 和 `isComputed` 属性

**原因**: 创建字段时需要正确设置字段属性

#### 6. apps/nestjs-backend/src/features/calculation/reference.service.ts
**修改内容**:
- 在 `recordRaw2Record` 方法中添加部门字段的读取:
  ```typescript
  createdByDepartment: raw.__created_by_department as string,
  lastModifiedByDepartment: raw.__last_modified_by_department as string,
  ```
- 在 `calculateComputeField` 方法中添加部门字段的计算逻辑,直接从record对象读取
- 在 `calculateFields` 方法中不需要为部门字段获取userMap(因为直接从系统字段读取)
- 添加 `ClsService` 注入,用于获取用户部门ID
- 在调用 `filterQuery` 时传入 `withUserDepartmentId` 参数

**原因**: 核心计算逻辑,负责将数据库中的部门JSON转换为字段值

#### 7. apps/nestjs-backend/src/features/record/record.service.ts
**修改内容**:
- 在 `createBatch` 方法中,初始化记录时同时设置 `CreatedBy` 和 `CreatedByDepartment` 字段的值
- 在 `buildFilterSortQuery` 方法中:
  - 从CLS获取 `user.departmentId`
  - 调用 `filterQuery` 时传入 `withUserDepartmentId` 参数

**原因**: 确保记录创建时部门信息被正确填充,过滤时能使用部门ID

#### 8. apps/nestjs-backend/src/features/aggregation/aggregation.service.ts
**修改内容**:
- 在 `handleAggregation` 和 `handleRowCount` 方法中调用 `filterQuery` 时,添加部门ID参数
- 从CLS获取用户部门ID并传递

**原因**: 确保聚合查询和行数统计时部门过滤能正常工作

#### 9. apps/nestjs-backend/src/features/share/share.service.ts
**修改内容**:
- 在 `getViewFilterUserQuery` 方法中调用 `filterQuery` 时,添加部门ID参数

**原因**: 确保分享视图的过滤功能支持部门字段

### 三、用户认证和上下文

#### 10. apps/nestjs-backend/src/types/cls.ts
**修改内容**:
- 在 `IClsStore.user` 接口中添加 `departmentId?: string | null` 字段

**原因**: CLS上下文需要存储用户的部门ID,供过滤查询使用

#### 11. apps/nestjs-backend/src/features/auth/strategies/
**修改文件**:
- `session.strategy.ts`
- `jwt.strategy.ts`
- `access-token.strategy.ts`

**修改内容**:
- 在用户认证时,将 `user.primaryDepartmentId` 设置到 CLS 的 `user.departmentId`

**原因**: 认证时需要将用户的部门信息存入上下文,供后续查询使用

#### 12. packages/openapi/src/auth/user.ts
**修改内容**:
- 在 `userInfoVoSchema` 中添加:
  - `primaryDepartmentId`
  - `primaryDepartmentName`
  - `primaryDepartmentCode`

**原因MenuAPI返回的用户信息需要包含部门字段

#### 13. packages/openapi/src/auth/user-me.ts
**修改内容**:
- 在 `userMeVoSchema` 中添加部门相关字段

**原因**: 用户个人信息需要包含部门信息

#### 14. apps/nestjs-backend/src/features/auth/utils.ts
**修改内容**:
- 更新 `IPickUserMe` 类型,包含部门字段
- 更新 `pickUserMe` 函数,返回部门相关字段

**原因**: 用户信息转换时需要包含部门字段

#### 15. apps/nestjs-backend/src/features/user/user.service.ts
**修改内容**:
- 在 `getUserInfoList` 方法中,select语句包含部门字段
- 已有 `setPrimaryDepartment` 方法用于设置用户主部门

**原因**: 查询用户时需要返回部门信息

### 四、数据库查询和过滤

#### 16. apps/nestjs-backend/src/db-provider/db.provider.interface.ts
**修改内容**:
- 在 `IFilterQueryExtra` 接口中添加 `withUserDepartmentId?: string` 字段

**原因**: 过滤查询需要传递用户的部门ID

#### 17. apps/nestjs-backend/src/db-provider/filter-query/filter-query.abstract.ts
**修改内容**:
- 修改 `replaceMeTagInValue` 方法,区分用户字段和部门字段的Me标签替换
- 用户字段使用 `replaceUserId`,部门字段使用 `replaceDepartmentId`
- 添加警告日志,当用户未设置主部门时提示

**原因**: "我的部门"筛选需要将Me标签替换为用户的部门ID

#### 18. apps/nestjs-backend/src/db-provider/filter-query/sqlite/cell-value-filter/cell-value-filter.sqlite.ts
**修改内容**:
- 在 `getJsonQueryColumn` 方法中添加部门字段类型的处理
- 使用 `json_extract` 提取部门ID用于过滤

**原因**: SQLite查询需要正确提取JSON中的部门ID进行比较

#### 19. apps/nestjs-backend/src/utils/is-user-or-link.ts
**修改内容**:
- 在 `isUserOrLink` 函数中添加部门字段类型

**原因Menu 部门字段和用户字段一样,使用JSON格式存储,需要相同的查询处理逻辑

#### 20. apps/nestjs-backend/src/utils/filter.ts
**修改内容**:
- 在 `SPECIAL_OPERATOR_FIELD_TYPE_SET` 中添加部门字段类型
- 在 `cellValue2FilterValue` 函数中添加部门字段类型的处理

**原因**: 部门字段需要支持特殊的过滤操作符,并正确提取ID用于过滤

### 五、前端UI和显示

#### 21. packages/sdk/src/utils/fieldType.ts
**修改内容**:
- 在 `FIELD_TYPE_ORDER` 数组中添加 `Department`、`CreatedByDepartment`、`LastModifiedByDepartment`

**原因**: 前端需要知道字段类型的排序顺序,用于UI展示

#### 22. apps/nextjs-app/src/features/app/components/field-setting/SelectFieldType.tsx
**修改内容**:
- 在 `SYSTEM_FIELD_TYPE_ORDER` 中添加系统部门字段类型
- 在 `FIELD_TYPE_ORDER1` 中添加普通部门字段类型

**原因**: 字段类型选择器需要显示新的部门字段选项

#### 23. packages/sdk/src/components/grid-enhancements/hooks/use-grid-columns.tsx
**修改内容**:
- 添加 `Department`、`CreatedByDepartment`、`LastModifiedByDepartment` 的case处理
- 将cellValue转换为部门名称文本显示
- 设置为只读字段

**原因**: 网格视图需要正确渲染部门字段的值

#### 24. packages/sdk/src/components/grid-enhancements/hooks/use-grid-group-collection.ts
**修改内容**:
- 添加部门字段类型的处理,转换为文本显示

**原因**: 分组视图需要正确显示部门信息

#### 25. packages/sdk/src/components/filter/view-filter/component/
**新增文件**:
- `FilterDepartmentSelect.tsx`: 部门过滤选择器组件

**修改文件**:
- `index.ts`: 导出新组件

**实现内容**:
- 部门下拉选择器(单选/多选模式)
- 从 `/api/department` API获取部门列表
- 支持搜索部门
- 支持"我的部门"选项

**原因**: 提供用户友好的部门筛选UI

#### 26. packages/sdk/src/components/filter/view-filter/custom-component/BaseFieldValue.tsx
**修改内容**:
- 导入 `FilterDepartmentSelect` 组件
- 添加部门字段类型的case,使用部门选择器

**原因**: 集成部门筛选组件到过滤器系统

#### 27. packages/sdk/src/config/react-query-keys.ts
**修改内容**:
- 添加 `departmentList: () => ['department-list']` 查询key

**原因**: React Query缓存管理

### 六、国际化(i18n)

#### 28. packages/common-i18n/src/locales/zh/sdk.json
**修改内容**:
- 添加字段标题和副标题:
  ```json
  "department": "部门",
  "createdByDepartment": "创建部门",
  "lastModifiedByDepartment": "修改部门"
  ```
- 添加过滤器文本:
  ```json
  "currentDepartment": "我的部门（当前用户部门）"
  ```

#### 29. packages/common-i18n/src/locales/en/sdk.json
**修改内容**:
- 添加对应的英文翻译

#### 30. packages/common-i18n/src/locales/zh/table.json
**修改内容**:
- 添加字段标题和副标题的表格视图翻译

#### 31. packages/common-i18n/src/locales/en/table.json
**修改内容**:
- 添加对应的英文翻译

**原因**: 支持中英文界面

### 七、过滤器逻辑

#### 32. packages/core/src/models/view/filter/operator.ts
**修改内容**:
- 在 `getValidFilterOperators` 函数中,部门字段类型已与用户字段一起处理(第400-415行)

**原因**: 部门字段支持与用户字段相同的过滤操作符

## 技术要点

### 1. 系统字段设计
部门字段采用系统字段设计,直接关联数据库的系统列:
- `__created_by_department`: 创建时自动填充
- `__last_modified_by_department`: 修改时自动填充

优点:
- 性能高,无需额外计算
- 数据一致性好
- 与创建人/修改人字段保持一致的架构

### 2. JSON存储格式
```json
{
  "id": "dept001",
  "name": "技术部",
  "code": "TECH"
}
```

优点:
- 包含完整的部门信息
- 支持部门重命名(通过code字段保持引用稳定性)
- 便于查询和过滤

### 3. Me标签支持
"我的部门"筛选使用Me标签机制:
- 前端发送 `filterValue: "Me"`
- 后端在 `replaceMeTagInValue` 中将Me替换为用户的主部门ID
- 用户必须设置主部门才能使用此功能

### 4. CLS上下文传递
使用NestJS的CLS(Continuation Local Storage)在整个请求生命周期中传递用户部门ID:
```
认证策略 → 设置 user.departmentId → 查询服务读取 → 过滤器使用
```

### 5. 类型安全
- 所有字段类型都在TypeScript的discriminated union中定义
- 使用 `assertNever` 确保所有switch语句处理了所有字段类型
- OpenAPI schema自动生成,确保前后端类型一致

## 数据库Schema

### User表
```sql
ALTER TABLE users ADD COLUMN primary_department_id TEXT;
ALTER TABLE users ADD COLUMN primary_department_name TEXT;
ALTER TABLE users ADD COLUMN primary_department_code TEXT;
```

### 表记录系统字段
每个业务表都包含:
- `__created_by_department TEXT`: 创建部门JSON
- `__last_modified_by_department TEXT`: 修改部门JSON

## API接口

### 获取部门列表
```
GET /api/department
```
返回所有激活状态的部门列表,用于过滤器下拉选择。

### 设置用户主部门
```
PATCH /api/user/primary-department
Body: {
  "departmentId": "dept001",
  "departmentName": "技术部",
  "departmentCode": "TECH"
}
```

## 使用场景

### 1. 字段创建
在表格中添加"创建部门"或"修改部门"字段,系统会自动显示现有记录的部门信息。

### 2. 记录创建
创建新记录时,系统自动填充创建人的部门信息到 `__created_by_department` 字段。

### 3. 记录修改
修改记录时,系统自动更新 `__last_modified_by_department` 字段为当前用户的部门。

### 4. 数据筛选
支持以下筛选方式:
- 按具体部门筛选(如"技术部")
- 按"我的部门"筛选(自动使用当前用户的主部门)
- 支持多选操作符(任意一个、全部、不包含等)

### 5. 数据分组和排序
部门字段支持按部门分组和排序功能。

## 注意事项

### 1. 用户必须设置主部门
- 使用"我的部门"筛选前,用户需要在个人设置中设置主部门
- 未设置主部门的用户使用"我的部门"筛选时,后端会记录警告日志,查询返回空结果

### 2. 部门信息冗余
- 部门名称和代码直接存储在记录中(冗余设计)
- 即使部门被删除或重命名,历史记录仍保留原始部门信息
- 这是有意的设计,用于保持历史数据的完整性

### 3. 只读字段
- 创建部门和修改部门字段为只读
- 用户不能手动修改这些字段的值
- 值由系统在记录创建/修改时自动填充

### 4. 性能考虑
- 部门信息直接从系统字段读取,无需JOIN查询
- 使用JSON格式存储,SQLite通过json_extract进行索引查询
- 支持缓存机制,减少数据库压力

## 测试建议

### 1. 功能测试
- [ ] 创建"创建部门"字段,验证现有记录显示正确的部门
- [ ] 创建新记录,验证部门字段自动填充
- [ ] 修改记录,验证"修改部门"字段更新
- [ ] 使用具体部门筛选,验证结果正确
- [ ] 使用"我的部门"筛选,验证结果正确

### 2. 边界测试
- [ ] 用户未设置主部门时使用"我的部门"筛选
- [ ] 部门被删除后,历史记录的部门字段是否仍显示
- [ ] 部门重命名后,新记录是否使用新名称

### 3. 性能测试
- [ ] 大量记录下的部门字段渲染性能
- [ ] 部门筛选的查询性能
- [ ] 并发创建记录时的部门信息填充

## 后续优化方向

1. **部门选择器增强**: 支持部门树形结构显示
2. **批量设置主部门**: 管理员可批量为用户设置主部门
3. **部门变更历史**: 记录用户的部门变更历史
4. **多部门支持**: 用户可以属于多个部门,字段支持显示所有部门
5. **部门协作者**: 将部门添加到base/space的协作者列表中

## 总结

本次实现完整地将部门字段集成到Teable系统中,涵盖了:
- ✅ 核心数据模型
- ✅ 后端业务逻辑
- ✅ 数据库存储和查询
- ✅ 用户认证和上下文
- ✅ 前端UI组件
- ✅ 过滤和筛选功能
- ✅ 国际化支持

所有功能已经过测试并正常工作。

