# Teable API 返回数据格式文档

## 📊 后端返回给前端的数据格式

### 1️⃣ 记录查询 API - `/api/table/{tableId}/record`

#### 请求参数

```typescript
interface IGetRecordsRo {
  // 视图相关
  viewId?: string;              // 视图 ID
  ignoreViewQuery?: boolean;    // 忽略视图查询
  
  // 过滤
  filter?: IFilter;             // 过滤条件
  filterByTql?: string;         // TQL 查询（已废弃）
  search?: [string, string?, boolean?]; // 搜索
  
  // 排序和分组
  orderBy?: ISortItem[];        // 排序
  groupBy?: string[];           // 分组字段 ID
  collapsedGroupIds?: string[]; // 折叠的分组 ID
  
  // 分页
  take?: number;                // 每页数量（默认 100，最大 2000）
  skip?: number;                // 跳过数量（默认 0）
  
  // 字段选择
  projection?: string[];        // 要返回的字段
  fieldKeyType?: FieldKeyType;  // 字段键类型（name | id | dbFieldName）
  cellFormat?: CellFormat;      // 单元格格式（json | text）
  
  // 特殊过滤
  filterLinkCellCandidate?: string | [string, string];
  filterLinkCellSelected?: string | [string, string];
  selectedRecordIds?: string[];
}
```

#### 返回格式

```typescript
interface IRecordsVo {
  records: IRecord[];  // 记录数组
  extra?: {            // 额外信息（可选）
    groupPoints?: IGroupPointsVo;      // 分组点信息
    allGroupHeaderRefs?: IGroupHeaderRef[]; // 所有分组头引用
  };
}

// 单条记录格式
interface IRecord {
  id: string;                    // 记录 ID，如 'recXXXXXXX'
  fields: Record<string, unknown>; // 字段数据
  
  // 以下字段可选（取决于 projection）
  createdTime?: string;          // 创建时间（ISO 8601）
  createdBy?: string;            // 创建者 ID
  lastModifiedTime?: string;     // 最后修改时间
  lastModifiedBy?: string;       // 最后修改者 ID
  autoNumber?: number;           // 自动编号
}
```

#### 示例

**请求**：
```http
GET /api/table/tblXXXXXXX/record?viewId=viwYYYYYYY&take=100&skip=0
```

**返回**：
```json
{
  "records": [
    {
      "id": "recABCDEFG",
      "fields": {
        "姓名": "张三",
        "年龄": 28,
        "状态": "进行中",
        "创建时间": "2025-01-15T08:30:00.000Z"
      },
      "createdTime": "2025-01-15T08:30:00.000Z",
      "createdBy": "usrXXXXXXX",
      "lastModifiedTime": "2025-01-15T10:20:00.000Z",
      "lastModifiedBy": "usrYYYYYYY",
      "autoNumber": 1
    },
    {
      "id": "recHIJKLMN",
      "fields": {
        "姓名": "李四",
        "年龄": 32,
        "状态": "已完成",
        "创建时间": "2025-01-16T09:15:00.000Z"
      },
      "createdTime": "2025-01-16T09:15:00.000Z",
      "createdBy": "usrXXXXXXX",
      "lastModifiedTime": "2025-01-16T14:30:00.000Z",
      "lastModifiedBy": "usrXXXXXXX",
      "autoNumber": 2
    }
  ],
  "extra": {
    "groupPoints": {
      "points": [
        {
          "id": "grp_1",
          "type": "HEADER",
          "depth": 0,
          "value": "进行中",
          "count": 5
        },
        {
          "id": "rec_1",
          "type": "ROW",
          "depth": 1,
          "recordId": "recABCDEFG"
        }
        // ...
      ]
    }
  }
}
```

---

### 2️⃣ 单条记录 API - `/api/table/{tableId}/record/{recordId}`

#### 返回格式

```typescript
// 直接返回 IRecord 对象
{
  "id": "recXXXXXXX",
  "fields": {
    "单行文本": "text value",
    "数字": 42,
    "日期": "2025-01-15T08:30:00.000Z"
  },
  "createdTime": "2025-01-15T08:30:00.000Z",
  "createdBy": "usrXXXXXXX"
}
```

---

### 3️⃣ 字段列表 API - `/api/table/{tableId}/field`

#### 返回格式

```typescript
// 返回字段数组
IFieldVo[]

interface IFieldVo {
  id: string;                    // 字段 ID，如 'fldXXXXXXX'
  name: string;                  // 字段名称
  type: FieldType;               // 字段类型
  description?: string;          // 字段描述
  options: IFieldOptions;        // 字段选项（根据类型不同而不同）
  dbFieldName: string;           // 数据库字段名
  dbFieldType: DbFieldType;      // 数据库字段类型
  isComputed: boolean;           // 是否为计算字段
  isPrimary: boolean;            // 是否为主字段
  isLookup: boolean;             // 是否为查找字段
  hasError?: boolean;            // 是否有错误
  notNull?: boolean;             // 是否不允许为空
  unique?: boolean;              // 是否唯一
  cellValueType: CellValueType;  // 单元格值类型
  version: number;               // 字段版本
}
```

#### 字段类型示例

```typescript
enum FieldType {
  SingleLineText = 'singleLineText',
  LongText = 'longText',
  Number = 'number',
  SingleSelect = 'singleSelect',
  MultipleSelect = 'multipleSelect',
  Date = 'date',
  Checkbox = 'checkbox',
  User = 'user',
  Attachment = 'attachment',
  Link = 'link',
  Formula = 'formula',
  Rollup = 'rollup',
  CreatedTime = 'createdTime',
  LastModifiedTime = 'lastModifiedTime',
  CreatedBy = 'createdBy',
  LastModifiedBy = 'lastModifiedBy',
  AutoNumber = 'autoNumber',
  Rating = 'rating',
  Button = 'button',
  // ...
}
```

#### 示例

```json
[
  {
    "id": "fldXXXXXXX",
    "name": "姓名",
    "type": "singleLineText",
    "dbFieldName": "__fld_name",
    "dbFieldType": "text",
    "isPrimary": true,
    "isComputed": false,
    "cellValueType": "string",
    "options": {},
    "version": 1
  },
  {
    "id": "fldYYYYYYY",
    "name": "状态",
    "type": "singleSelect",
    "dbFieldName": "__fld_status",
    "dbFieldType": "text",
    "isPrimary": false,
    "isComputed": false,
    "cellValueType": "string",
    "options": {
      "choices": [
        { "id": "sel1", "name": "待处理", "color": "blue" },
        { "id": "sel2", "name": "进行中", "color": "yellow" },
        { "id": "sel3", "name": "已完成", "color": "green" }
      ]
    },
    "version": 1
  },
  {
    "id": "fldZZZZZZZ",
    "name": "总价",
    "type": "formula",
    "dbFieldName": "__fld_total",
    "dbFieldType": "real",
    "isPrimary": false,
    "isComputed": true,
    "cellValueType": "number",
    "options": {
      "expression": "{数量} * {单价}",
      "formatting": { "type": "decimal", "precision": 2 }
    },
    "version": 1
  }
]
```

---

### 4️⃣ 视图列表 API - `/api/table/{tableId}/view`

#### 返回格式

```typescript
IViewVo[]

interface IViewVo {
  id: string;                    // 视图 ID，如 'viwXXXXXXX'
  name: string;                  // 视图名称
  type: ViewType;                // 视图类型
  description?: string;          // 视图描述
  options: IViewOptions;         // 视图选项
  order: number;                 // 排序顺序
  version: number;               // 视图版本
  shareMeta?: IShareViewMeta;    // 共享元数据
  columnMeta?: IColumnMeta;      // 列元数据
  filter?: IFilter;              // 视图过滤
  sort?: ISortItem[];            // 视图排序
  group?: IGroup[];              // 视图分组
}

enum ViewType {
  Grid = 'grid',
  Form = 'form',
  Kanban = 'kanban',
  Gallery = 'gallery',
  Calendar = 'calendar',
}
```

#### 示例

```json
[
  {
    "id": "viwABCDEFG",
    "name": "所有任务",
    "type": "grid",
    "order": 0,
    "version": 1,
    "options": {},
    "columnMeta": {
      "fldXXXXXXX": { "width": 200, "hidden": false },
      "fldYYYYYYY": { "width": 150, "hidden": false }
    },
    "filter": {
      "conjunction": "and",
      "filterSet": [
        {
          "fieldId": "fldStatus",
          "operator": "isNot",
          "value": "已删除"
        }
      ]
    },
    "sort": [
      { "fieldId": "fldCreatedTime", "order": "desc" }
    ]
  },
  {
    "id": "viwHIJKLMN",
    "name": "看板视图",
    "type": "kanban",
    "order": 1,
    "version": 1,
    "options": {
      "stackFieldId": "fldStatus",
      "coverFieldId": "fldAttachment",
      "isFieldNameHidden": false
    }
  }
]
```

---

### 5️⃣ 权限 API - `/api/base/{baseId}/permission`

#### 返回格式

```typescript
Record<string, boolean>

// 权限键值对
{
  "space|read": true,
  "space|update": false,
  "base|read": true,
  "base|update": true,
  "base|delete": false,
  "table|read": true,
  "table|create": true,
  "table|update": true,
  "table|delete": false,
  "field|read": true,
  "field|create": true,
  "field|update": true,
  "field|delete": false,
  "record|read": true,
  "record|create": true,
  "record|update": true,
  "record|delete": true,
  "record|comment": true,
  "view|read": true,
  "view|create": true,
  "view|update": true,
  "view|delete": true,
  "view|share": false
  // ... 50+ 权限
}
```

---

### 6️⃣ 用户信息 API - `/api/auth/user/me`

#### 返回格式

```typescript
interface IUserMeVo {
  id: string;                    // 用户 ID
  name: string;                  // 用户名
  email: string;                 // 邮箱
  phone?: string;                // 手机号
  avatar?: string;               // 头像 URL
  hasPassword: boolean;          // 是否设置了密码
  isAdmin: boolean;              // 是否为管理员
  notifyMeta: {                  // 通知设置
    email?: boolean;
    sms?: boolean;
  };
  organization?: IOrganization;  // 组织信息
}
```

#### 示例

```json
{
  "id": "usrXXXXXXX",
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "+86 138****1234",
  "avatar": "https://example.com/avatars/user.jpg",
  "hasPassword": true,
  "isAdmin": false,
  "notifyMeta": {
    "email": true,
    "sms": false
  },
  "organization": {
    "id": "orgXXXXXXX",
    "name": "我的组织"
  }
}
```

---

### 7️⃣ 聚合查询 API - `/api/table/{tableId}/aggregation`

#### 返回格式

```typescript
interface IAggregationVo {
  aggregations: IAggregationField[];
}

interface IAggregationField {
  fieldId: string;               // 字段 ID
  statisticFunc: StatisticFunc;  // 聚合函数
  value: number | string | null; // 聚合结果
}

type StatisticFunc =
  | 'count' | 'empty' | 'filled' | 'unique'
  | 'max' | 'min' | 'sum' | 'average'
  | 'percentEmpty' | 'percentFilled' | 'percentUnique'
  | 'earliestDate' | 'latestDate' | 'dateRangeOfDays'
  | 'totalAttachmentSize';
```

#### 示例

```json
{
  "aggregations": [
    {
      "fieldId": "fldPrice",
      "statisticFunc": "sum",
      "value": 125000
    },
    {
      "fieldId": "fldQuantity",
      "statisticFunc": "average",
      "value": 42.5
    },
    {
      "fieldId": "fldStatus",
      "statisticFunc": "count",
      "value": 150
    },
    {
      "fieldId": "fldCreatedTime",
      "statisticFunc": "earliestDate",
      "value": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 8️⃣ 分组点 API - `/api/table/{tableId}/group-points`

#### 返回格式

```typescript
interface IGroupPointsVo {
  points: IGroupPoint[];
}

type IGroupPoint = IGroupHeaderPoint | IGroupRowPoint;

interface IGroupHeaderPoint {
  id: string;                    // 分组 ID
  type: 'HEADER';                // 类型：分组头
  depth: number;                 // 嵌套深度
  value: unknown;                // 分组值
  count: number;                 // 记录数量
  isCollapsed?: boolean;         // 是否折叠
}

interface IGroupRowPoint {
  id: string;                    // 行 ID
  type: 'ROW';                   // 类型：记录行
  depth: number;                 // 嵌套深度
  recordId: string;              // 记录 ID
}
```

#### 示例

```json
{
  "points": [
    {
      "id": "grp_status_pending",
      "type": "HEADER",
      "depth": 0,
      "value": "待处理",
      "count": 5,
      "isCollapsed": false
    },
    {
      "id": "grp_user_zhang",
      "type": "HEADER",
      "depth": 1,
      "value": { "id": "usrXXX", "title": "张三" },
      "count": 2,
      "isCollapsed": false
    },
    {
      "id": "rec_1",
      "type": "ROW",
      "depth": 2,
      "recordId": "recABCDEFG"
    },
    {
      "id": "rec_2",
      "type": "ROW",
      "depth": 2,
      "recordId": "recHIJKLMN"
    },
    {
      "id": "grp_user_li",
      "type": "HEADER",
      "depth": 1,
      "value": { "id": "usrYYY", "title": "李四" },
      "count": 3,
      "isCollapsed": true
    }
  ]
}
```

---

## 🎯 字段值格式

不同字段类型的单元格值格式：

### 文本类型

```typescript
// 单行文本 / 长文本
"Hello World"

// URL
"https://example.com"

// 邮箱
"user@example.com"

// 电话
"+86 138****1234"
```

### 数字类型

```typescript
// 数字
42
3.14159

// 货币
1234.56

// 百分比
0.85  // 显示为 85%
```

### 选择类型

```typescript
// 单选
"选项1"

// 多选
["选项1", "选项2", "选项3"]
```

### 日期类型

```typescript
// 日期（ISO 8601 格式）
"2025-01-15T08:30:00.000Z"

// 仅日期
"2025-01-15"
```

### 布尔类型

```typescript
// 复选框
true
false
```

### 关联类型

```typescript
// Link（关联字段）
{
  "id": "recXXXXXXX",
  "title": "关联记录的标题"
}

// 多条关联
[
  { "id": "recXXXXXXX", "title": "记录1" },
  { "id": "recYYYYYYY", "title": "记录2" }
]
```

### 附件类型

```typescript
// Attachment
[
  {
    "id": "attXXXXXXX",
    "name": "文件.pdf",
    "size": 1024000,
    "mimetype": "application/pdf",
    "path": "uploads/xxx/file.pdf",
    "presignedUrl": "https://storage.example.com/file.pdf?token=xxx",
    "width": null,
    "height": null
  },
  {
    "id": "attYYYYYYY",
    "name": "图片.jpg",
    "size": 204800,
    "mimetype": "image/jpeg",
    "path": "uploads/yyy/image.jpg",
    "presignedUrl": "https://storage.example.com/image.jpg?token=yyy",
    "width": 1920,
    "height": 1080
  }
]
```

### 用户类型

```typescript
// User
{
  "id": "usrXXXXXXX",
  "title": "张三",
  "avatarUrl": "https://example.com/avatar.jpg"
}

// 多个用户
[
  { "id": "usrXXXXXXX", "title": "张三" },
  { "id": "usrYYYYYYY", "title": "李四" }
]
```

### 评分类型

```typescript
// Rating
4  // 1-5 星
```

---

## 📋 错误响应格式

### HTTP 错误响应

```typescript
interface IHttpError {
  statusCode: number;            // HTTP 状态码
  message: string;               // 错误消息
  error: string;                 // 错误类型
  code?: string;                 // 业务错误码
}
```

### 示例

```json
{
  "statusCode": 403,
  "message": "No permission to update record",
  "error": "Forbidden",
  "code": "NO_PERMISSION"
}
```

### 常见错误码

```typescript
{
  "400": "Bad Request - 请求参数错误",
  "401": "Unauthorized - 未登录",
  "403": "Forbidden - 无权限",
  "404": "Not Found - 资源不存在",
  "409": "Conflict - 数据冲突",
  "422": "Unprocessable Entity - 数据验证失败",
  "500": "Internal Server Error - 服务器错误"
}
```

---

## 🔗 相关文档

- [Part 1: Packages 包结构](./TEABLE_ARCHITECTURE_01_PACKAGES.md)
- [Part 2: 页面渲染与数据保存](./TEABLE_ARCHITECTURE_02_RENDERING.md)
- [Part 3: 权限控制系统](./TEABLE_ARCHITECTURE_03_PERMISSION.md)
- [Part 4: 完整功能流程](./TEABLE_ARCHITECTURE_04_WORKFLOWS.md)
- [Part 5: 数据查询系统](./TEABLE_ARCHITECTURE_05_QUERY.md)

**总索引**：[Teable 架构文档索引](./TEABLE_ARCHITECTURE_INDEX.md)



