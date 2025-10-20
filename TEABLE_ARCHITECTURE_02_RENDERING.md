# Teable 技术架构文档 - Part 2: 页面渲染与数据保存

## 🎨 主页面渲染流程

### 1. 应用入口 (_app.tsx)

```typescript
// apps/nextjs-app/src/pages/_app.tsx
const MyApp = (appProps: AppPropsWithLayout) => {
  const { Component, pageProps } = appProps;
  const { user, env } = pageProps;
  
  return (
    <AppProviders env={env}>
      <Head>
        <meta name="viewport" content="..." />
        <style>{getColorsCssVariablesText(colors)}</style>
      </Head>
      
      {/* 分析工具 */}
      <MicrosoftClarity />
      <Umami />
      <GoogleAnalytics />
      
      {/* 页面内容 */}
      {getLayout(<Component {...pageProps} />)}
      
      {/* 用户指引 */}
      {user && <Guide user={user} />}
      
      {/* 路由进度条 */}
      <RouterProgressBar />
    </AppProviders>
  );
};
```

**AppProviders 包含**：
- QueryClientProvider (React Query)
- ConnectionProvider (ShareDB)
- SessionProvider (用户会话)
- ThemeProvider (主题)
- I18nProvider (国际化)

---

### 2. 表格页面渲染 ([baseId]/[tableId]/[viewId].tsx)

#### 2.1 服务端渲染 (SSR)

```typescript
// 页面路由: /base/{baseId}/{tableId}/{viewId}
export const getServerSideProps = withEnv(
  ensureLogin(  // ✅ 确保用户已登录
    withAuthSSR(async (context, ssrApi) => {
      const queryClient = new QueryClient();
      
      // 并行获取所有数据
      const data = await getViewPageServerData({
        ...query,
        ssrApi,
        queryClient,
      });
      
      return {
        props: {
          ...data,
          dehydratedState: dehydrate(queryClient),
          ...(await getTranslationsProps(context, i18nNamespaces)),
        },
      };
    })
  )
);
```

**SSR 数据获取**：
```typescript
// lib/view-pages-data.ts
async function getViewPageServerData() {
  // 并行请求，优化性能
  const [
    baseRes,
    tableRes,
    viewListRes,
    fieldListRes,
    recordsRes,
    aggregationRes,
  ] = await Promise.all([
    ssrApi.getBaseById(baseId),
    ssrApi.getTableById(baseId, tableId),
    ssrApi.getViews(tableId),
    ssrApi.getFields(tableId),
    ssrApi.getRecords(tableId, { viewId, ... }),
    ssrApi.getAggregation(tableId, { viewId, ... }),
  ]);
  
  return {
    fieldServerData: fieldListRes.data,
    viewServerData: viewListRes.data,
    recordsServerData: recordsRes.data,
    // ...
  };
}
```

#### 2.2 客户端渲染

```tsx
// Table 组件层级
<AnchorContext.Provider value={{ tableId, viewId, baseId }}>
  <TablePermissionProvider baseId={baseId}>
    <ViewProvider serverData={viewServerData}>
      <PersonalViewProxy serverData={viewServerData}>
        <div className="flex h-full">
          <div className="flex flex-1 flex-col">
            {/* 表格头部 */}
            <TableHeader />
            
            {/* 字段数据 */}
            <FieldProvider serverSideData={fieldServerData}>
              <ErrorBoundary fallback={<FailAlert />}>
                <PersonalViewProvider>
                  {/* 视图渲染 */}
                  <View
                    recordServerData={recordServerData}
                    recordsServerData={recordsServerData}
                    groupPointsServerDataMap={groupPointsServerDataMap}
                  />
                </PersonalViewProvider>
              </ErrorBoundary>
            </FieldProvider>
          </div>
          
          {/* 插件面板 */}
          <PluginPanel tableId={tableId} />
          <PluginContextMenu tableId={tableId} baseId={baseId} />
        </div>
      </PersonalViewProxy>
    </ViewProvider>
  </TablePermissionProvider>
</AnchorContext.Provider>
```

---

### 3. 视图渲染 (View.tsx)

根据视图类型渲染不同组件：

```tsx
const View = ({ recordsServerData, recordServerData, groupPointsServerDataMap }) => {
  const viewId = useViewId();
  const view = useView(viewId);
  
  switch (view?.type) {
    case ViewType.Grid:
      return (
        <SearchProvider>
          <RecordProvider serverRecords={recordsServerData.records}>
            <AggregationProvider>
              <TaskStatusCollectionProvider>
                <RowCountProvider>
                  <GridToolBar />
                  <GridViewBase groupPointsServerDataMap={...} />
                </RowCountProvider>
              </TaskStatusCollectionProvider>
            </AggregationProvider>
          </RecordProvider>
        </SearchProvider>
      );
      
    case ViewType.Form:
      return <FormView />;
      
    case ViewType.Kanban:
      return <KanbanView />;
      
    case ViewType.Gallery:
      return <GalleryView />;
      
    case ViewType.Calendar:
      return <CalendarView />;
      
    default:
      return null;
  }
};
```

---

### 4. Grid 表格渲染 (高性能核心)

#### 4.1 虚拟化渲染

```tsx
// GridViewBaseInner.tsx
const GridViewBaseInner = () => {
  // 使用虚拟化加载记录
  const { 
    recordMap,      // 当前加载的记录 Map
    onVisibleRegionChanged  // 可见区域变化回调
  } = useGridAsyncRecords(initRecords);
  
  // 只加载 300 条记录
  const LOAD_PAGE_SIZE = 300;
  
  // 计算可见区域
  const visiblePages = { y: scrollTop, height: viewportHeight };
  
  // 动态加载数据
  useEffect(() => {
    if (需要加载更多) {
      fetchMore({ skip: currentSkip + 300, take: 300 });
    }
  }, [visiblePages]);
  
  return (
    <Grid
      rowCount={totalRowCount}  // 可能是百万级
      getCellContent={getCellContent}  // 获取单元格内容
      onVisibleRegionChanged={onVisibleRegionChanged}  // 滚动回调
      onCellEdited={onCellEdited}  // 编辑回调
      // ...
    />
  );
};
```

#### 4.2 Canvas 渲染

```tsx
// Grid.tsx -> RenderLayer.tsx
const RenderLayer = (props) => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const cacheCanvas = useMemo(() => document.createElement('canvas'), []);
  
  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    if (!mainCanvas) return;
    
    // 调用渲染函数
    drawGrid(mainCanvas, cacheCanvas, {
      visibleRegion,     // 可见区域
      coordInstance,     // 坐标管理器
      getCellContent,    // 获取单元格内容
      theme,             // 主题
      selection,         // 选择状态
      // ...
    });
  }, [visibleRegion, selection, forceRenderFlag, ...]);
  
  return <canvas ref={mainCanvasRef} />;
};
```

**渲染步骤**：
1. 计算可见区域（startRow, stopRow, startCol, stopCol）
2. 只渲染可见单元格（30-50 行）
3. 使用 Canvas 2D API 绘制
4. 双缓冲技术（mainCanvas + cacheCanvas）
5. 滚动时动态重绘

**性能优化**：
- ✅ 虚拟化：只渲染可见行
- ✅ Canvas 渲染：比 DOM 快 10-100 倍
- ✅ 双缓冲：减少闪烁
- ✅ 增量更新：只重绘变化部分
- ✅ GPU 加速：使用 transform

---

### 5. 单元格编辑流程

```
用户双击单元格
    ↓
onCellEdited 回调
    ↓
record.updateCell(fieldId, newValue)
    ↓
┌─────────────────────────────────┐
│ Record Model                    │
│ 1. 乐观更新本地（立即显示新值） │
│ 2. 调用 updateRecord API        │
│ 3. 成功：更新计算字段           │
│ 4. 失败：回滚到旧值             │
└─────────────────────────────────┘
    ↓
HTTP POST /api/table/{tableId}/record/{recordId}
    ↓
后端处理（见 Part 3）
```

---

## 💾 数据保存的主要类

### 1. 前端数据模型

#### Record 类 (packages/sdk/src/model/record/record.ts)

```typescript
export class Record extends RecordCore {
  constructor(
    protected doc: Doc<IRecord>,  // ShareDB Document
    protected fieldMap: { [fieldId: string]: IFieldInstance }
  ) {
    super(fieldMap);
  }
  
  // 核心方法：更新单元格
  async updateCell(
    fieldId: string,
    cellValue: unknown,
    localization?: { t: ILocaleFunction; prefix?: string }
  ) {
    const oldCellValue = this.fields[fieldId];
    const cellSaveStatus = useCellSaveStatus.getState();
    
    try {
      // 1. 标记为保存中（蓝色边框）
      cellSaveStatus.setSaving(this.id, fieldId);
      
      // 2. 乐观更新本地
      this.onCommitLocal(fieldId, cellValue);
      this.fields[fieldId] = cellValue;
      
      // 3. 发送到服务器
      const [, tableId] = this.doc.collection.split('_');
      const res = await updateRecord(tableId, this.doc.id, {
        fieldKeyType: FieldKeyType.Id,
        record: { fields: { [fieldId]: cellValue } },
      });
      
      // 4. 标记为已保存（绿色边框闪烁）
      cellSaveStatus.setSaved(this.id, fieldId);
      
      // 5. 更新计算字段（公式、关联等）
      this.updateComputedField(computedFieldIds, res.data);
      
    } catch (error) {
      // 6. 失败：回滚 + 红色边框
      this.onCommitLocal(fieldId, oldCellValue, true);
      cellSaveStatus.setError(this.id, fieldId);
      toast.error(getHttpErrorMessage(error));
    }
  }
  
  // 本地提交（ShareDB 操作）
  private onCommitLocal(fieldId: string, cellValue: unknown, undo?: boolean) {
    const operation = RecordOpBuilder.editor.setRecord.build({
      fieldId,
      newCellValue: cellValue,
      oldCellValue,
    });
    this.doc.data.fields[fieldId] = cellValue;
    this.doc.emit('op batch', [operation], false);
    if (undo) {
      this.doc.version--;
    } else {
      this.doc.version++;
    }
  }
}
```

#### Field 类 (packages/sdk/src/model/field/*.ts)

```typescript
// 字段工厂
export function createFieldInstanceByVo(fieldVo: IFieldVo): IFieldInstance {
  switch (fieldVo.type) {
    case FieldType.SingleLineText:
      return new SingleLineTextField(fieldVo);
    case FieldType.Number:
      return new NumberField(fieldVo);
    case FieldType.Link:
      return new LinkField(fieldVo);
    case FieldType.Formula:
      return new FormulaField(fieldVo);
    // ... 20+ 字段类型
  }
}

// 字段基类
abstract class FieldCore {
  abstract cellValue2String(value: unknown): string;
  abstract convertStringToCellValue(str: string): unknown;
  abstract validateCellValue(value: unknown): boolean;
}
```

### 2. 后端数据服务

#### RecordOpenApiService (核心保存逻辑)

```typescript
// apps/nestjs-backend/src/features/record/open-api/record-open-api.service.ts
@Injectable()
export class RecordOpenApiService {
  
  @retryOnDeadlock()  // 死锁自动重试
  async updateRecords(
    tableId: string,
    updateRecordsRo: IUpdateRecordsRo,
    windowId?: string
  ) {
    const { records, order, fieldKeyType, typecast } = updateRecordsRo;
    
    // 在事务中执行
    const cellContexts = await this.prismaService.$tx(async () => {
      // 1. 更新排序
      if (order) {
        await this.viewOpenApiService.updateRecordOrders(...);
      }
      
      // 2. 验证字段值并类型转换
      const typecastRecords = await this.validateFieldsAndTypecast(
        tableId, records, fieldKeyType, typecast
      );
      
      // 3. 更新系统字段（lastModifiedTime, lastModifiedBy）
      const preparedRecords = await this.systemFieldService.getModifiedSystemOpsMap(
        tableId, fieldKeyType, typecastRecords
      );
      
      // 4. 计算依赖字段（公式、关联、汇总等）
      return await this.recordCalculateService.calculateUpdatedRecord(
        tableId, fieldKeyType, preparedRecords
      );
    });
    
    // 5. 发射操作事件（用于实时同步）
    if (windowId) {
      this.eventEmitterService.emitAsync(Events.OPERATION_RECORDS_UPDATE, {
        tableId,
        windowId,
        userId: this.cls.get('user.id'),
        recordIds,
        fieldIds,
        cellContexts,
      });
    }
    
    // 6. 返回更新后的记录
    return { records: snapshots, cellContexts };
  }
}
```

#### RecordService (记录操作)

```typescript
@Injectable()
export class RecordService {
  // 获取记录
  async getRecord(
    tableId: string,
    recordId: string,
    query?: IGetRecordQuery
  ): Promise<IRecord>
  
  // 获取记录列表
  async getRecords(
    tableId: string,
    query: IGetRecordsRo
  ): Promise<IRecordsVo>
  
  // 创建记录
  async createRecords(
    tableId: string,
    records: IRecordCreateRo[]
  ): Promise<IRecord[]>
  
  // 删除记录
  async deleteRecords(
    tableId: string,
    recordIds: string[]
  ): Promise<void>
  
  // 获取快照（带权限过滤）
  async getSnapshotBulkWithPermission(
    tableId: string,
    recordIds: string[],
    projection?: string[],
    fieldKeyType?: FieldKeyType
  ): Promise<ISnapshot[]>
}
```

#### RecordCalculateService (计算引擎)

```typescript
@Injectable()
export class RecordCalculateService {
  // 计算更新的记录（核心方法）
  async calculateUpdatedRecord(
    tableId: string,
    fieldKeyType: FieldKeyType,
    records: { id: string; fields: { [fieldId]: unknown } }[],
    isNewRecord?: boolean
  ) {
    // 1. 生成原始操作
    const originCellContexts = await this.generateCellContexts(
      tableId, fieldKeyType, records, isNewRecord
    );
    
    // 2. 转换为操作 Map
    const opsMapOrigin = formatChangesToOps(
      originCellContexts.map((data) => ({
        tableId,
        recordId: data.recordId,
        fieldId: data.fieldId,
        newValue: data.newValue,
        oldValue: data.oldValue,
      }))
    );
    
    // 3. 计算派生字段变化
    await this.calculate(tableId, opsMapOrigin, originCellContexts);
    
    return originCellContexts;
  }
  
  // 计算依赖链
  private async calculate(
    tableId: string,
    opsMapOrigin: IOpsMap,
    originCellContexts: ICellContext[]
  ) {
    // 调用 ReferenceService 计算依赖
    await this.referenceService.calculateOpsMap(opsMapOrigin);
    
    // 保存计算结果到数据库
    await this.batchService.updateRecords(opsMap, fieldMap, tableId2DbTableName);
  }
}
```

---

## 🔄 完整的数据保存流程

### 前端 → 后端流程

```
1. 用户编辑单元格
   ↓
2. GridViewBaseInner.onCellEdited()
   ↓
3. record.updateCell(fieldId, newValue)
   ┌─────────────────────────────────┐
   │ Record Model (前端)              │
   │ - 乐观更新 UI（立即显示）        │
   │ - 设置保存状态（蓝色边框）       │
   │ - 调用 API                       │
   └─────────────────────────────────┘
   ↓
4. updateRecord(tableId, recordId, recordRo)
   ↓
5. HTTP POST /api/table/{tableId}/record/{recordId}
   ↓
6. RecordOpenApiController.updateRecord()
   ↓
7. RecordOpenApiService.updateRecord()
   ┌─────────────────────────────────┐
   │ 后端处理                         │
   │ - 验证权限                       │
   │ - 验证字段值                     │
   │ - 开启数据库事务                 │
   │ - 更新系统字段                   │
   │ - 计算依赖字段                   │
   │ - 保存到数据库                   │
   │ - 提交事务                       │
   └─────────────────────────────────┘
   ↓
8. 事务提交后钩子
   ┌─────────────────────────────────┐
   │ - 发射事件（EventEmitter）       │
   │ - ShareDB 发布操作               │
   │ - 清除缓存                       │
   └─────────────────────────────────┘
   ↓
9. ShareDB Pub/Sub
   ↓
10. WebSocket 推送到所有客户端
   ↓
11. 前端接收更新
    ┌─────────────────────────────────┐
    │ - ShareDB 文档更新               │
    │ - 触发 'op batch' 事件           │
    │ - React 组件重新渲染             │
    │ - 设置保存状态（绿色边框）       │
    └─────────────────────────────────┘
```

---

## 🎯 关键数据保存类总结

### 前端核心类

| 类 | 位置 | 主要职责 |
|---|------|---------|
| **Record** | `packages/sdk/src/model/record/record.ts` | 记录操作、乐观更新、错误回滚 |
| **Field** | `packages/sdk/src/model/field/*.ts` | 字段类型定义、值转换、验证 |
| **View** | `packages/sdk/src/model/view/*.ts` | 视图状态管理 |
| **useCellSaveStatus** | `packages/sdk/src/hooks/use-cell-save-status.ts` | 单元格保存状态管理 |

### 后端核心类

| 类 | 位置 | 主要职责 |
|---|------|---------|
| **RecordOpenApiService** | `apps/nestjs-backend/src/features/record/open-api/record-open-api.service.ts` | API 入口、事务管理 |
| **RecordService** | `apps/nestjs-backend/src/features/record/record.service.ts` | 记录 CRUD 操作 |
| **RecordCalculateService** | `apps/nestjs-backend/src/features/record/record-calculate/record-calculate.service.ts` | 计算引擎入口 |
| **ReferenceService** | `apps/nestjs-backend/src/features/calculation/reference.service.ts` | 依赖图计算 |
| **BatchService** | `apps/nestjs-backend/src/features/calculation/batch.service.ts` | 批量数据库更新 |
| **ShareDbService** | `apps/nestjs-backend/src/share-db/share-db.service.ts` | 实时同步核心 |

---

## 🔄 实时同步机制

### ShareDB 架构

```typescript
// 前端订阅
const doc = connection.get(`${IdPrefix.Record}_${tableId}`, recordId);

doc.subscribe(() => {
  // 监听操作
  doc.on('op batch', (ops) => {
    // 更新 React 组件
    setInstance(createRecordInstance(doc.data, doc));
  });
});

// 后端发布
async publishOpsMap(rawOpMaps: IRawOpMap[]) {
  for (const collection in rawOpMap) {
    for (const docId in data) {
      const channels = [collection, `${collection}.${docId}`];
      
      // 发布到频道
      this.pubsub.publish(channels, rawOp, noop);
    }
  }
}
```

### 频道设计

```
全局频道：
- dtbl_{tableId}           - 表格级别变更
- fld_{fieldId}            - 字段级别变更
- rec_{tableId}            - 记录集合变更
- rec_{tableId}.{recordId} - 单条记录变更
- viw_{viewId}             - 视图变更

特殊频道：
- action_trigger_{tableId} - 动作触发
- base_permission_{baseId} - 权限变更
- user_notification_{userId} - 用户通知
```

---

**下一部分**：权限控制系统



