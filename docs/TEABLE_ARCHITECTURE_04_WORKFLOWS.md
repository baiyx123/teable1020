# Teable 技术架构文档 - Part 4: 完整功能流程与总结

## 🎬 完整功能流程示例

### 场景 1：用户编辑单元格（端到端）

```
┌─────────────────────────────────────────────────────────┐
│ 1. 用户操作（浏览器）                                    │
└─────────────────────────────────────────────────────────┘
用户双击单元格，输入"新值"，按 Enter

┌─────────────────────────────────────────────────────────┐
│ 2. 前端事件处理                                          │
└─────────────────────────────────────────────────────────┘
GridViewBaseInner.onCellEdited([col, row], newInnerCell)
    ↓
提取 record = recordMap[row]
提取 fieldId = columns[col].id
    ↓
检查权限：permission['record|update'] ✅
    ↓
调用：record.updateCell(fieldId, newCellValue, { t })

┌─────────────────────────────────────────────────────────┐
│ 3. Record Model 处理                                     │
└─────────────────────────────────────────────────────────┘
Record.updateCell(fieldId, cellValue) {
  const oldCellValue = this.fields[fieldId];
  const cellSaveStatus = useCellSaveStatus.getState();
  
  try {
    // 3.1 设置保存状态
    cellSaveStatus.setSaving(this.id, fieldId);
    // → 单元格边框变为蓝色 🔵
    
    // 3.2 乐观更新
    this.onCommitLocal(fieldId, cellValue);
    // → ShareDB 本地文档更新
    // → React 组件立即重新渲染
    // → 用户立即看到新值
    
    // 3.3 发送 HTTP 请求
    const res = await updateRecord(tableId, recordId, {
      fieldKeyType: FieldKeyType.Id,
      record: { fields: { [fieldId]: cellValue } },
    });
    
    // 3.4 成功标记
    cellSaveStatus.setSaved(this.id, fieldId);
    // → 边框变为绿色 ✨
    // → 0.5秒后消失
    
  } catch (error) {
    // 3.5 失败处理
    this.onCommitLocal(fieldId, oldCellValue, true);
    // → 回滚到旧值
    cellSaveStatus.setError(this.id, fieldId);
    // → 边框变为红色 🔴
    toast.error(error.message);
    // → 显示错误提示
  }
}

┌─────────────────────────────────────────────────────────┐
│ 4. HTTP 请求                                             │
└─────────────────────────────────────────────────────────┘
POST /api/table/{tableId}/record/{recordId}
Headers: {
  'x-window-id': 'window-xxx',  // 标识发起操作的窗口
  'Authorization': 'Bearer xxx',
}
Body: {
  fieldKeyType: 'id',
  record: {
    fields: {
      'fldXXX': '新值'
    }
  }
}

┌─────────────────────────────────────────────────────────┐
│ 5. 后端 Controller                                       │
└─────────────────────────────────────────────────────────┘
@Permissions('record|update')  // ← 权限检查
@Patch(':recordId')
async updateRecord(
  @Param('tableId') tableId,
  @Param('recordId') recordId,
  @Body() updateRecordRo,
  @Headers('x-window-id') windowId
) {
  return await this.recordOpenApiService.updateRecord(
    tableId, recordId, updateRecordRo, windowId
  );
}

┌─────────────────────────────────────────────────────────┐
│ 6. 后端 Service 层                                       │
└─────────────────────────────────────────────────────────┘
RecordOpenApiService.updateRecord() {
  const oldCellValue = await this.getOldValue(...);
  
  // 开启事务
  const cellContexts = await this.prismaService.$tx(async () => {
    
    // 6.1 验证字段值
    const typecastRecords = await this.validateFieldsAndTypecast(
      tableId, records, fieldKeyType, typecast
    );
    // → 检查数据类型是否匹配
    // → 自动类型转换（如果允许）
    
    // 6.2 更新系统字段
    const preparedRecords = await this.systemFieldService.getModifiedSystemOpsMap(
      tableId, fieldKeyType, typecastRecords
    );
    // → lastModifiedTime = now()
    // → lastModifiedBy = currentUser
    
    // 6.3 计算依赖字段（核心！）
    return await this.recordCalculateService.calculateUpdatedRecord(
      tableId, fieldKeyType, preparedRecords
    );
    // → 构建依赖图
    // → 拓扑排序
    // → 按序计算公式、关联、汇总字段
  });
  
  // 事务提交成功
  
  // 6.4 发射事件
  this.eventEmitterService.emitAsync(Events.OPERATION_RECORDS_UPDATE, {
    tableId, windowId, userId, recordIds, fieldIds, cellContexts
  });
  
  return { records, cellContexts };
}

┌─────────────────────────────────────────────────────────┐
│ 7. 计算引擎（ReferenceService）                          │
└─────────────────────────────────────────────────────────┘
async calculateOpsMap(opsMap) {
  // 7.1 构建字段依赖图
  const directedGraph = buildDependencyGraph(affectedFields);
  // 示例：A → B → C → D
  //      A → E
  
  // 7.2 拓扑排序
  const topoOrders = getTopoOrders(directedGraph);
  // 结果：[A, B, E, C, D]
  
  // 7.3 按序计算
  for (const fieldId of topoOrders) {
    const field = fieldMap[fieldId];
    
    if (field.type === FieldType.Formula) {
      // 计算公式
      const newValue = await this.calculateFormula(field, record);
      await this.updateCell(tableId, recordId, fieldId, newValue);
    }
    
    if (field.type === FieldType.Rollup) {
      // 计算汇总
      const newValue = await this.calculateRollup(field, linkedRecords);
      await this.updateCell(tableId, recordId, fieldId, newValue);
    }
    
    if (field.type === FieldType.Link) {
      // 更新关联关系
      await this.updateLinkField(field, foreignKeys);
    }
  }
}

┌─────────────────────────────────────────────────────────┐
│ 8. 数据库更新（BatchService）                            │
└─────────────────────────────────────────────────────────┘
async updateRecords(opsMap, fieldMap, tableId2DbTableName) {
  for (const [tableId, recordOps] of Object.entries(opsMap)) {
    const dbTableName = tableId2DbTableName[tableId];
    
    // 批量更新 SQL
    await this.executeUpdateRecords(dbTableName, fieldMap, opsData);
    
    // 保存原始操作（用于撤销/重做）
    await this.saveRawOps(tableId, RawOpType.Edit, opDataList);
  }
}

// 生成的 SQL 示例
UPDATE "tbl_xxx" 
SET 
  "__version" = "__version" + 1,
  "__last_modified_time" = NOW(),
  "__last_modified_by" = 'usr_yyy',
  "fld_zzz" = '新值'
WHERE "__id" = 'rec_aaa';

┌─────────────────────────────────────────────────────────┐
│ 9. 事务提交后（bindAfterTransaction）                    │
└─────────────────────────────────────────────────────────┘
prismaService.bindAfterTransaction(async () => {
  const rawOpMaps = cls.get('tx.rawOpMaps');
  
  // 9.1 发布到 ShareDB
  await this.shareDbService.publishOpsMap(rawOpMaps);
  // → Redis Pub/Sub 或本地 EventEmitter
  
  // 9.2 转换为事件
  this.eventEmitterService.ops2Event(rawOpMaps);
  // → RecordUpdateEvent
  // → 触发监听器
  
  // 9.3 清除缓存
  await this.clearCacheKeys(clearCacheKeys);
});

┌─────────────────────────────────────────────────────────┐
│ 10. ShareDB 同步                                         │
└─────────────────────────────────────────────────────────┘
ShareDbService.publishOpsMap(rawOpMaps) {
  for (const docId in data) {
    const rawOp = {
      c: 'rec_tableId',        // collection
      d: 'rec_recordId',       // document id
      v: 123,                  // version
      op: [{                   // operations
        p: ['fields', 'fldXXX'],  // path
        od: '旧值',              // old data
        oi: '新值',              // new/insert data
      }]
    };
    
    // 发布到频道
    const channels = [
      'rec_tableId',           // 表格级
      'rec_tableId.recordId',  // 记录级
    ];
    this.pubsub.publish(channels, rawOp);
  }
}

┌─────────────────────────────────────────────────────────┐
│ 11. WebSocket 推送                                       │
└─────────────────────────────────────────────────────────┘
// 所有订阅了该频道的客户端收到消息
WebSocket Message: {
  a: 'op',              // action
  c: 'rec_tableId',     // collection
  d: 'recordId',        // document
  v: 123,               // version
  op: [...]             // operations
}

┌─────────────────────────────────────────────────────────┐
│ 12. 其他客户端更新                                       │
└─────────────────────────────────────────────────────────┘
// 用户 B 的浏览器
doc.on('op batch', (ops) => {
  // 应用操作到本地文档
  applyOps(doc.data, ops);
  
  // 触发 React 重新渲染
  setInstance(createRecordInstance(doc.data, doc));
});

// 用户 B 看到单元格自动更新为"新值" ✅

┌─────────────────────────────────────────────────────────┐
│ 完成！总耗时约 100-500ms                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 场景 2：创建新记录

```
用户点击"添加行"
    ↓
GridViewBaseInner.onRowAppend()
    ↓
调用：createRecords API
    ↓
POST /api/table/{tableId}/record
Body: {
  records: [{
    fields: {
      'name': '',           // 主字段留空
      'createdTime': now(), // 自动填充
      'createdBy': userId,  // 自动填充
    }
  }]
}
    ↓
RecordOpenApiService.createRecords() {
  await this.prismaService.$tx(async () => {
    // 1. 生成记录 ID
    const recordIds = records.map(() => generateRecordId());
    
    // 2. 填充默认值
    const recordsWithDefaults = await this.fillDefaultValues(records);
    
    // 3. 验证必填字段
    await this.validateRequiredFields(records);
    
    // 4. 计算公式字段初始值
    const cellContexts = await this.recordCalculateService.calculateCreatedRecord(
      tableId, recordsWithDefaults
    );
    
    // 5. 插入数据库
    await this.insertRecords(dbTableName, recordsWithDefaults);
    
    // 6. 保存操作记录
    await this.saveRawOps(tableId, RawOpType.Create, opDataList);
  });
  
  // 7. 发射事件
  this.eventEmitterService.emitAsync(Events.TABLE_RECORD_CREATE, {...});
}
    ↓
ShareDB 同步到所有客户端
    ↓
新记录出现在所有用户的表格中 ✅
```

---

## 🔍 场景 3：删除记录（带权限检查）

```
用户选择多行，右键 → 删除
    ↓
确认对话框："确定删除 50 条记录吗？"
    ↓
用户点击"确认"
    ↓
useSelectionOperation.doDelete(selection)
    ↓
显示 Toast：🔄 "正在删除..."
    ↓
DELETE /api/table/{tableId}/record
Body: {
  ranges: [[0, 49]],  // 行范围
  type: 'row'
}
    ↓
RecordOpenApiController.deleteRecords()
    ↓
@Permissions('record|delete') 装饰器检查 ✅
    ↓
RecordOpenApiService.deleteRecords() {
  // 1. 检查记录是否 undeletable
  const records = await this.getRecords(recordIds);
  const deletableRecords = records.filter(r => !r.undeletable);
  
  // 2. 移动到回收站（软删除）
  await this.prismaService.$tx(async () => {
    await this.prismaService.record.updateMany({
      where: { id: { in: deletableRecordIds } },
      data: {
        deletedTime: new Date(),
        deletedBy: userId,
      },
    });
    
    // 3. 更新关联字段
    await this.updateLinkFieldsOnDelete(tableId, recordIds);
    
    // 4. 保存操作
    await this.saveRawOps(tableId, RawOpType.Delete, opDataList);
  });
  
  // 5. 发射事件
  this.eventEmitterService.emitAsync(Events.TABLE_RECORD_DELETE, {...});
}
    ↓
事件监听器执行：
- AttachmentListener: 删除附件引用
- RecordHistoryListener: 记录历史
- CollaboratorNotificationListener: 通知协作者
    ↓
ShareDB 同步删除到所有客户端
    ↓
Toast 更新：✅ "删除成功"
    ↓
所有用户看到记录消失
```

---

## 🔍 场景 4：字段类型转换

```
用户打开字段设置 → 修改类型（文本 → 数字）
    ↓
FieldSetting.onSave()
    ↓
验证选项：validateFieldOptions() ✅
    ↓
PUT /api/table/{tableId}/field/{fieldId}/convert
Body: {
  type: 'number',
  options: {
    precision: 2,
    formatting: { type: 'decimal' }
  }
}
    ↓
FieldOpenApiService.convertField() {
  await this.prismaService.$tx(async () => {
    // 1. 检查转换计划
    const plan = await this.calculateConversionPlan(
      tableId, fieldId, newType, newOptions
    );
    // → 分析数据兼容性
    // → 预览转换结果
    // → 检测可能丢失的数据
    
    // 2. 执行转换
    for (const step of plan.steps) {
      switch (step.type) {
        case 'ALTER_COLUMN':
          await this.dbProvider.alterColumn(dbTableName, field, newField);
          break;
          
        case 'CONVERT_DATA':
          await this.convertCellValues(tableId, fieldId, converter);
          break;
          
        case 'UPDATE_LINKS':
          await this.updateLinkReferences(tableId, fieldId);
          break;
      }
    }
    
    // 3. 更新字段元数据
    await this.prismaService.field.update({
      where: { id: fieldId },
      data: {
        type: newType,
        options: newOptions,
        dbFieldType: newDbFieldType,
      },
    });
    
    // 4. 重新计算依赖字段
    await this.recalculateDependentFields(tableId, fieldId);
  });
  
  // 5. 发射事件
  this.eventEmitterService.emitAsync(Events.OPERATION_FIELD_CONVERT, {...});
}
    ↓
ShareDB 同步字段变更
    ↓
所有客户端刷新字段定义
    ↓
表格自动重新渲染 ✅
```

---

## 🔍 场景 5：公式字段自动计算

```
用户创建公式字段：SUM({销售额})
    ↓
POST /api/table/{tableId}/field
Body: {
  type: 'formula',
  options: {
    expression: 'SUM({销售额})'
  }
}
    ↓
FieldOpenApiService.createField() {
  // 1. 解析公式
  const ast = parseFormula('SUM({销售额})');
  // → 抽象语法树
  
  // 2. 提取依赖字段
  const dependencies = extractDependencies(ast);
  // → ['fld_salesAmount']
  
  // 3. 创建字段
  const field = await this.prismaService.field.create({
    data: {
      type: FieldType.Formula,
      options: { expression: '...' },
      isComputed: true,  // 标记为计算字段
    },
  });
  
  // 4. 计算所有记录的初始值
  const allRecords = await this.recordService.getAllRecords(tableId);
  
  for (const record of allRecords) {
    // 执行公式
    const value = await this.formulaService.execute(
      ast,
      record,
      fieldMap
    );
    
    // 保存结果
    await this.updateCell(tableId, record.id, field.id, value);
  }
}
    ↓
以后每次更新"销售额"字段时：
    ↓
ReferenceService 自动检测依赖
    ↓
重新计算公式字段
    ↓
自动更新到数据库
    ↓
ShareDB 同步到客户端
    ↓
用户看到公式字段自动变化 ✨
```

---

## 📊 数据流转总览图

```
┌──────────────────────────────────────────────────────┐
│                    浏览器层                           │
├──────────────────────────────────────────────────────┤
│  React Components (Grid, Form, Kanban...)           │
│         ↓                 ↑                           │
│  SDK Models (Record, Field, View)                    │
│         ↓                 ↑                           │
│  ShareDB Client Document                             │
│         ↓                 ↑                           │
│  OpenAPI Client (HTTP/WebSocket)                     │
└──────────────────────────────────────────────────────┘
         ↓                 ↑
    HTTP/WebSocket    WebSocket Push
         ↓                 ↑
┌──────────────────────────────────────────────────────┐
│                    服务器层                           │
├──────────────────────────────────────────────────────┤
│  NestJS Controllers (@Permissions 装饰器)            │
│         ↓                                             │
│  Service 层 (业务逻辑)                                │
│         ↓                                             │
│  Calculation 层 (计算引擎)                            │
│         ↓                                             │
│  Prisma Service ($tx 事务)                           │
│         ↓                                             │
│  Database (PostgreSQL / SQLite)                      │
│                                                       │
│  事务提交后 ─→ ShareDB Server ─→ WebSocket           │
│                     ↓                                 │
│              EventEmitter (异步监听器)                │
│              - RecordHistoryListener                  │
│              - AttachmentListener                     │
│              - ActionTriggerListener                  │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 关键设计模式

### 1. 乐观更新（Optimistic Update）

```typescript
// 立即更新 UI，后台保存
async updateCell(fieldId, value) {
  this.fields[fieldId] = value;  // ← 立即更新
  try {
    await api.updateRecord(...);  // ← 后台保存
  } catch (error) {
    this.fields[fieldId] = oldValue;  // ← 失败回滚
  }
}
```

### 2. 操作转换（OT - Operational Transformation）

```typescript
// 并发编辑冲突解决
{
  p: ['fields', 'name'],  // path
  od: 'Alice',            // old data
  oi: 'Bob',              // new/insert data
}
```

### 3. 事件驱动（Event-Driven）

```typescript
// 发射事件
eventEmitter.emitAsync(Events.TABLE_RECORD_UPDATE, event);

// 多个监听器异步处理
@OnEvent(Events.TABLE_RECORD_UPDATE, { async: true })
async handleUpdate(event) {
  // 记录历史、更新附件、通知协作者...
}
```

### 4. 依赖注入（DI）

```typescript
@Injectable()
export class RecordService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
    private readonly permissionService: PermissionService,
    // ... 自动注入
  ) {}
}
```

### 5. 虚拟化渲染（Virtualization）

```typescript
// 只渲染可见部分
const virtualRows = rowVirtualizer.getVirtualItems();
// → 百万行数据，只渲染 30-50 行
```

---

## 📚 核心技术栈总结

### 前端技术栈

| 技术 | 用途 | 关键特性 |
|------|------|---------|
| **Next.js 14** | React 框架 | SSR, ISR, API Routes |
| **React 18** | UI 框架 | Hooks, Suspense, Concurrent |
| **TypeScript** | 类型安全 | 严格模式，完整类型覆盖 |
| **ShareDB** | 实时协作 | OT 算法，冲突解决 |
| **React Query** | 数据获取 | 缓存，自动重试，乐观更新 |
| **Zustand** | 状态管理 | 轻量，精确订阅 |
| **Glide Data Grid** | 表格基础 | Canvas 渲染，虚拟化 |
| **Tailwind CSS** | 样式 | 原子化 CSS |
| **Zod** | 数据验证 | 运行时类型检查 |

### 后端技术栈

| 技术 | 用途 | 关键特性 |
|------|------|---------|
| **NestJS** | Node.js 框架 | 模块化，依赖注入，装饰器 |
| **Prisma** | ORM | 类型安全，迁移管理 |
| **ShareDB** | 实时同步 | OT 引擎，Pub/Sub |
| **BullMQ** | 任务队列 | 异步任务，重试机制 |
| **Redis** | 缓存/队列 | Pub/Sub，会话存储 |
| **PostgreSQL** | 主数据库 | ACID，RLS，JSON 支持 |
| **SQLite** | 开发数据库 | 轻量，嵌入式 |
| **ANTLR4** | 公式解析 | 语法解析，AST 构建 |

---

## 🏗️ 架构优势

### ✅ 性能优势

1. **Canvas 渲染** - 比 DOM 快 10-100 倍
2. **虚拟化** - 支持百万级数据
3. **分页加载** - 每次只加载 300 条
4. **增量更新** - 只重绘变化部分
5. **缓存策略** - 多层缓存优化

### ✅ 实时协作

1. **ShareDB OT** - 自动解决冲突
2. **WebSocket** - 毫秒级同步
3. **Redis Pub/Sub** - 多实例同步
4. **乐观更新** - 零延迟体验

### ✅ 可扩展性

1. **Monorepo** - 模块化，独立发布
2. **插件系统** - 第三方扩展
3. **公式引擎** - 自定义计算
4. **视图系统** - 多种展示方式

### ✅ 数据安全

1. **RBAC 权限** - 5 种角色，50+ 权限
2. **字段级权限** - 细粒度控制
3. **事务保证** - ACID 特性
4. **审计日志** - 完整历史追溯
5. **数据备份** - 操作可撤销

---

## 📖 学习路径建议

### 新手入门

1. **熟悉 packages/core** - 理解数据模型和业务逻辑
2. **查看 packages/sdk** - 学习组件和 Hooks
3. **运行 apps/nextjs-app** - 体验前端功能
4. **调试 apps/nestjs-backend** - 理解后端流程

### 进阶学习

1. **ShareDB 同步机制** - 实时协作核心
2. **计算引擎** - 公式和依赖计算
3. **Canvas 渲染** - 高性能表格
4. **权限系统** - RBAC 实现

### 贡献代码

1. **阅读现有代码** - 理解代码风格
2. **运行测试** - `pnpm test`
3. **遵循规范** - ESLint + Prettier
4. **提交 PR** - 小步提交，清晰描述

---

## 🎉 总结

Teable 是一个**高性能、实时协作的无代码数据库平台**，架构特点：

### 核心优势

1. **🚀 高性能**
   - Canvas 渲染支持百万级数据
   - 虚拟化加载
   - 智能缓存

2. **👥 实时协作**
   - ShareDB OT 算法
   - WebSocket 实时同步
   - 冲突自动解决

3. **🎨 灵活展示**
   - 5 种视图类型
   - 20+ 字段类型
   - 自定义公式

4. **🔒 安全可靠**
   - RBAC 权限系统
   - 事务保证
   - 完整审计

5. **🔌 可扩展**
   - 插件系统
   - 自定义视图
   - API 集成

### 技术亮点

- ✨ **Monorepo 架构** - 模块化、可维护
- ✨ **TypeScript 全栈** - 类型安全
- ✨ **事件驱动** - 解耦、易扩展
- ✨ **计算引擎** - 自动化数据处理
- ✨ **乐观更新** - 流畅用户体验

---

## 📚 相关文档索引

- **Part 1**: [Packages 包结构](./TEABLE_ARCHITECTURE_01_PACKAGES.md)
- **Part 2**: [页面渲染与数据保存](./TEABLE_ARCHITECTURE_02_RENDERING.md)
- **Part 3**: [权限控制系统](./TEABLE_ARCHITECTURE_03_PERMISSION.md)
- **Part 4**: [完整功能流程](./TEABLE_ARCHITECTURE_04_WORKFLOWS.md) (当前)
- **Part 5**: [数据查询系统](./TEABLE_ARCHITECTURE_05_QUERY.md)

### 实现文档

- [单元格保存状态功能](./packages/sdk/CELL_SAVE_STATUS.md)
- [实现完成总结](./IMPLEMENTATION_COMPLETE.md)

---

## 🚀 快速上手

```bash
# 1. 安装依赖
pnpm install

# 2. 选择数据库
make switch-db-mode  # 选择 sqlite 或 postgres

# 3. 启动开发服务器
cd apps/nestjs-backend
pnpm dev

# 4. 访问应用
open http://localhost:3000

# 5. 开始开发！
```

**祝您运动愉快！回来后就可以看到开发服务器运行了！** 🏃‍♂️💪

