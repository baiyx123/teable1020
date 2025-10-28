# Teable 单选字段（Single Select）API 指南

## 📚 单选字段创建 API

### API 端点

```
POST /api/table/{tableId}/field
```

### 请求结构

```typescript
// 请求头
Headers: {
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  'Content-Type': 'application/json'
}

// URL 参数
{
  tableId: 'tblxxxxxxxxxxxxx'  // 表格 ID
}

// 请求体
{
  name: '字段名称',              // 必填
  type: 'singleSelect',         // 字段类型
  description: '字段描述',       // 可选
  options: {
    choices: [                  // 选项列表
      {
        id: 'cho1',            // 可选：选项ID（不提供会自动生成）
        name: '选项名称',       // 必填：选项名称
        color: 'blue'          // 可选：颜色（不提供会自动分配）
      }
    ],
    defaultValue: '默认选项名',  // 可选：默认值
    preventAutoNewOptions: false // 可选：是否阻止自动创建新选项
  }
}
```

---

## 🎨 完整示例

### 示例 1：创建带选项的单选字段

```bash
curl -X POST \
  'http://localhost:3000/api/table/tblXXXXXXXXXXXXXXXX/field' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "name": "状态",
    "type": "singleSelect",
    "description": "任务状态",
    "options": {
      "choices": [
        {
          "id": "cho1",
          "name": "待处理",
          "color": "yellow"
        },
        {
          "id": "cho2",
          "name": "进行中",
          "color": "blue"
        },
        {
          "id": "cho3",
          "name": "已完成",
          "color": "green"
        },
        {
          "id": "cho4",
          "name": "已取消",
          "color": "red"
        }
      ]
    }
  }'
```

---

### 示例 2：最简单的创建（空选项列表）

```json
{
  "type": "singleSelect",
  "name": "类别",
  "options": {
    "choices": []
  }
}
```

**说明**：创建时可以不提供任何选项，后续可以通过更新 API 添加选项。

---

### 示例 3：创建时不指定 ID 和颜色（推荐）

```json
{
  "type": "singleSelect",
  "name": "优先级",
  "options": {
    "choices": [
      { "name": "高" },
      { "name": "中" },
      { "name": "低" }
    ]
  }
}
```

**说明**：
- `id` 不提供时会自动生成（如 `choXXXXXXXXXXXXXXXX`）
- `color` 不提供时会自动分配颜色

---

### 示例 4：带默认值的单选字段

```json
{
  "type": "singleSelect",
  "name": "审批状态",
  "options": {
    "choices": [
      { "name": "待审批", "color": "yellow" },
      { "name": "已通过", "color": "green" },
      { "name": "已拒绝", "color": "red" }
    ],
    "defaultValue": "待审批"
  }
}
```

**说明**：新记录创建时会自动填充"待审批"

---

## 🎨 可用颜色列表

```typescript
enum Colors {
  // 蓝色系
  BlueLight2 = 'blueLight2',
  BlueLight1 = 'blueLight1',
  BlueBright = 'blueBright',
  Blue = 'blue',
  BlueDark1 = 'blueDark1',

  // 青色系
  CyanLight2 = 'cyanLight2',
  CyanLight1 = 'cyanLight1',
  CyanBright = 'cyanBright',
  Cyan = 'cyan',
  CyanDark1 = 'cyanDark1',

  // 灰色系
  GrayLight2 = 'grayLight2',
  GrayLight1 = 'grayLight1',
  GrayBright = 'grayBright',
  Gray = 'gray',
  GrayDark1 = 'grayDark1',

  // 绿色系
  GreenLight2 = 'greenLight2',
  GreenLight1 = 'greenLight1',
  GreenBright = 'greenBright',
  Green = 'green',
  GreenDark1 = 'greenDark1',

  // 橙色系
  OrangeLight2 = 'orangeLight2',
  OrangeLight1 = 'orangeLight1',
  OrangeBright = 'orangeBright',
  Orange = 'orange',
  OrangeDark1 = 'orangeDark1',

  // 粉色系
  PinkLight2 = 'pinkLight2',
  PinkLight1 = 'pinkLight1',
  PinkBright = 'pinkBright',
  Pink = 'pink',
  PinkDark1 = 'pinkDark1',

  // 紫色系
  PurpleLight2 = 'purpleLight2',
  PurpleLight1 = 'purpleLight1',
  PurpleBright = 'purpleBright',
  Purple = 'purple',
  PurpleDark1 = 'purpleDark1',

  // 红色系
  RedLight2 = 'redLight2',
  RedLight1 = 'redLight1',
  RedBright = 'redBright',
  Red = 'red',
  RedDark1 = 'redDark1',

  // 青绿色系
  TealLight2 = 'tealLight2',
  TealLight1 = 'tealLight1',
  TealBright = 'tealBright',
  Teal = 'teal',
  TealDark1 = 'tealDark1',

  // 黄色系
  YellowLight2 = 'yellowLight2',
  YellowLight1 = 'yellowLight1',
  YellowBright = 'yellowBright',
  Yellow = 'yellow',
  YellowDark1 = 'yellowDark1',
}
```

**总计**：9 种颜色 × 5 种亮度 = **45 种颜色可选**

---

## 📋 选项字段详解

### Choice 对象结构

```typescript
interface ISelectFieldChoice {
  id?: string;      // 选项ID（可选，不提供会自动生成）
  name: string;     // 选项名称（必填，不能为空）
  color?: string;   // 颜色（可选，从 Colors 枚举中选择）
}
```

### Options 对象结构

```typescript
interface ISelectFieldOptions {
  choices: ISelectFieldChoice[];           // 选项列表（必填）
  defaultValue?: string;                   // 默认值（选项名称）
  preventAutoNewOptions?: boolean;         // 是否阻止自动创建新选项
}
```

---

## 🔧 TypeScript 代码示例

### 使用 SDK 创建单选字段

```typescript
import { createField } from '@teable/openapi';
import { FieldType, Colors } from '@teable/core';

// 示例 1: 完整配置
async function createStatusField(tableId: string) {
  const field = await createField(tableId, {
    name: '状态',
    type: FieldType.SingleSelect,
    description: '任务当前状态',
    options: {
      choices: [
        { id: 'cho_todo', name: '待处理', color: Colors.Yellow },
        { id: 'cho_doing', name: '进行中', color: Colors.Blue },
        { id: 'cho_done', name: '已完成', color: Colors.Green },
        { id: 'cho_cancel', name: '已取消', color: Colors.Red }
      ],
      defaultValue: '待处理'
    }
  });
  
  return field;
}

// 示例 2: 简化版（推荐）
async function createPriorityField(tableId: string) {
  const field = await createField(tableId, {
    name: '优先级',
    type: FieldType.SingleSelect,
    options: {
      choices: [
        { name: '高', color: Colors.Red },
        { name: '中', color: Colors.Yellow },
        { name: '低', color: Colors.Gray }
      ]
    }
  });
  
  return field;
}

// 示例 3: 让系统自动分配颜色
async function createCategoryField(tableId: string) {
  const field = await createField(tableId, {
    name: '分类',
    type: FieldType.SingleSelect,
    options: {
      choices: [
        { name: '技术' },
        { name: '产品' },
        { name: '设计' },
        { name: '运营' }
      ]
    }
  });
  
  return field;
}
```

---

## 📝 实际测试用例参考

### 来自项目测试代码

```typescript
// 来自: apps/nestjs-backend/test/data-helpers/20x.ts

const singleSelectField = {
  name: 'singleSelect field',
  description: 'the singleSelect field',
  type: FieldType.SingleSelect,
  options: {
    choices: [
      { id: 'choX', name: 'x', color: Colors.Cyan },
      { id: 'choY', name: 'y', color: Colors.Blue },
      { id: 'choZ', name: 'z', color: Colors.Gray },
    ],
  },
};
```

---

## 🔄 更新单选字段选项

### 添加新选项

```typescript
// PUT /api/table/{tableId}/field/{fieldId}
// 注意：需要提供完整的 choices 数组

await axios.patch(
  `/api/table/${tableId}/field/${fieldId}`,
  {
    options: {
      choices: [
        ...existingChoices,  // 保留原有选项
        { name: '新选项', color: Colors.Purple }  // 添加新选项
      ]
    }
  }
);
```

### 修改选项名称或颜色

```typescript
await axios.patch(
  `/api/table/${tableId}/field/${fieldId}`,
  {
    options: {
      choices: [
        { id: 'cho1', name: '新名称', color: Colors.Green },
        { id: 'cho2', name: '选项2', color: Colors.Blue }
      ]
    }
  }
);
```

### 删除选项

```typescript
// 只保留需要的选项，其他的会被删除
await axios.patch(
  `/api/table/${tableId}/field/${fieldId}`,
  {
    options: {
      choices: [
        { id: 'cho1', name: '保留的选项', color: Colors.Blue }
        // cho2, cho3 等未包含的选项会被删除
      ]
    }
  }
);
```

---

## 🎯 常见应用场景

### 场景 1：任务状态管理

```typescript
{
  name: '任务状态',
  type: 'singleSelect',
  options: {
    choices: [
      { name: '未开始', color: 'gray' },
      { name: '进行中', color: 'blue' },
      { name: '待审核', color: 'yellow' },
      { name: '已完成', color: 'green' },
      { name: '已取消', color: 'red' }
    ],
    defaultValue: '未开始'
  }
}
```

### 场景 2：优先级设置

```typescript
{
  name: '优先级',
  type: 'singleSelect',
  options: {
    choices: [
      { name: 'P0 - 紧急', color: 'redBright' },
      { name: 'P1 - 高', color: 'orangeBright' },
      { name: 'P2 - 中', color: 'yellowBright' },
      { name: 'P3 - 低', color: 'grayLight1' }
    ],
    defaultValue: 'P2 - 中'
  }
}
```

### 场景 3：审批流程

```typescript
{
  name: '审批状态',
  type: 'singleSelect',
  options: {
    choices: [
      { name: '草稿', color: 'gray' },
      { name: '待审批', color: 'yellow' },
      { name: '审批中', color: 'blue' },
      { name: '已通过', color: 'green' },
      { name: '已拒绝', color: 'red' },
      { name: '已撤回', color: 'grayLight1' }
    ]
  }
}
```

### 场景 4：产品类别

```typescript
{
  name: '产品类别',
  type: 'singleSelect',
  options: {
    choices: [
      { name: '电子产品', color: 'cyan' },
      { name: '服装鞋包', color: 'pink' },
      { name: '食品饮料', color: 'orange' },
      { name: '图书音像', color: 'purple' },
      { name: '家居生活', color: 'teal' },
      { name: '其他', color: 'gray' }
    ],
    preventAutoNewOptions: true  // 不允许自动添加新类别
  }
}
```

---

## 📊 完整的 JavaScript 示例

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

async function createSingleSelectField(tableId, fieldConfig) {
  try {
    const response = await axios.post(
      `${API_BASE}/table/${tableId}/field`,
      fieldConfig,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✓ 单选字段创建成功');
    console.log('字段ID:', response.data.id);
    console.log('字段名称:', response.data.name);
    console.log('选项数量:', response.data.options.choices.length);
    
    return response.data;
  } catch (error) {
    console.error('✗ 创建失败:', error.response?.data || error.message);
    throw error;
  }
}

// 使用示例
const fieldConfig = {
  name: '状态',
  type: 'singleSelect',
  options: {
    choices: [
      { name: '待处理', color: 'yellow' },
      { name: '进行中', color: 'blue' },
      { name: '已完成', color: 'green' }
    ],
    defaultValue: '待处理'
  }
};

createSingleSelectField('tblXXXXXXXXXXXXXXXX', fieldConfig);
```

---

## 🔄 将文本字段转换为单选字段

### API 端点

```
PUT /api/table/{tableId}/field/{fieldId}/convert
```

### 转换示例

```typescript
// 假设有一个文本字段，包含数据：'待处理', '进行中', '已完成'
// 想要转换为单选字段

await axios.put(
  `/api/table/${tableId}/field/${fieldId}/convert`,
  {
    type: 'singleSelect',
    options: {
      choices: [
        { name: '待处理', color: 'yellow' },
        { name: '进行中', color: 'blue' },
        { name: '已完成', color: 'green' },
        { name: '其他', color: 'gray' }  // 可以添加额外选项
      ]
    }
  }
);
```

**注意**：
- 转换时，原文本数据会尝试匹配 choices 中的名称
- 匹配不上的数据可能会被清空或保持原样（取决于具体实现）
- 建议先调用 plan API 预览转换结果

---

## 📐 Schema 定义

### Choice Schema

```typescript
const selectFieldChoiceSchema = z.object({
  id: z.string(),                    // 选项ID
  name: z.string()                   // 选项名称（会自动 trim）
    .transform((s) => s.trim())
    .pipe(z.string().min(1)),        // 不能为空字符串
  color: z.nativeEnum(Colors),       // 颜色枚举
});

// 创建时使用的 Schema（id 和 color 可选）
const selectFieldChoiceRoSchema = selectFieldChoiceSchema.partial({ 
  id: true, 
  color: true 
});
```

### Options Schema

```typescript
const selectFieldOptionsSchema = z.object({
  choices: z.array(selectFieldChoiceSchema),
  defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
  preventAutoNewOptions: z.boolean().optional(),
});
```

---

## ⚠️ 重要注意事项

### 1. Choice 名称唯一性
- 每个选项的 `name` 必须唯一
- 名称不能为空字符串
- 名称会自动 trim（去除首尾空格）

### 2. Choice ID 规则
- ID 格式：`cho` + 16位字母数字（如 `choXXXXXXXXXXXXXXXX`）
- 不提供时自动生成
- 一旦生成不建议修改

### 3. 默认值
- `defaultValue` 必须是 choices 中某个选项的 `name`
- 不能是不存在的选项名

### 4. 数据存储
- 单选字段存储的是**选项名称**（name），不是 ID
- 数据库中直接存储字符串，如 `'待处理'`

---

## 🛠️ 完整的创建流程示例

```typescript
import { createField } from '@teable/openapi';
import { FieldType, Colors } from '@teable/core';

// 第1步：定义选项
const choices = [
  { name: '待处理', color: Colors.Yellow },
  { name: '进行中', color: Colors.Blue },
  { name: '已完成', color: Colors.Green },
  { name: '已取消', color: Colors.Red }
];

// 第2步：创建字段
const statusField = await createField('tblXXXXXXXXXXXXXXXX', {
  name: '状态',
  type: FieldType.SingleSelect,
  description: '任务处理状态',
  options: {
    choices: choices,
    defaultValue: '待处理',
    preventAutoNewOptions: false
  }
});

console.log('字段创建成功:', statusField);

// 第3步：更新记录使用单选值
// 注意：赋值时使用选项的 name，不是 id
await updateRecord(tableId, recordId, {
  fieldKeyType: 'id',
  record: {
    fields: {
      [statusField.id]: '进行中'  // 使用选项名称
    }
  }
});
```

---

## 🌈 颜色分组建议

### 按语义分组

```typescript
// 状态类（红黄绿）
const statusColors = {
  pending: 'yellow',      // 待处理
  processing: 'blue',     // 进行中
  success: 'green',       // 成功
  failed: 'red',          // 失败
  cancelled: 'gray'       // 取消
};

// 优先级类（红橙黄灰）
const priorityColors = {
  urgent: 'redBright',    // 紧急
  high: 'orangeBright',   // 高
  medium: 'yellow',       // 中
  low: 'grayLight1'       // 低
};

// 类别类（多彩）
const categoryColors = [
  'blue', 'cyan', 'green', 'yellow', 
  'orange', 'red', 'pink', 'purple', 'teal'
];
```

---

## 🚀 使用 Axios 的完整示例

```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
    'Content-Type': 'application/json'
  }
});

// 创建单选字段
async function createSingleSelect(tableId) {
  try {
    const response = await client.post(
      `/table/${tableId}/field`,
      {
        name: '审批状态',
        type: 'singleSelect',
        options: {
          choices: [
            { name: '待提交', color: 'gray' },
            { name: '审批中', color: 'yellow' },
            { name: '已通过', color: 'green' },
            { name: '已拒绝', color: 'red' }
          ],
          defaultValue: '待提交',
          preventAutoNewOptions: true
        }
      }
    );
    
    console.log('创建成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('创建失败:', error.response?.data);
    throw error;
  }
}

// 获取字段信息
async function getField(tableId, fieldId) {
  const response = await client.get(`/table/${tableId}/field/${fieldId}`);
  return response.data;
}

// 更新选项
async function updateFieldChoices(tableId, fieldId, newChoices) {
  const response = await client.patch(
    `/table/${tableId}/field/${fieldId}`,
    {
      options: {
        choices: newChoices
      }
    }
  );
  return response.data;
}

// 示例用法
(async () => {
  const tableId = 'tblXXXXXXXXXXXXXXXX';
  
  // 1. 创建字段
  const field = await createSingleSelect(tableId);
  console.log('字段ID:', field.id);
  
  // 2. 获取字段
  const fieldInfo = await getField(tableId, field.id);
  console.log('字段选项:', fieldInfo.options.choices);
  
  // 3. 添加新选项
  const updatedChoices = [
    ...fieldInfo.options.choices,
    { name: '需补充', color: 'orange' }
  ];
  await updateFieldChoices(tableId, field.id, updatedChoices);
  
  console.log('选项更新成功');
})();
```

---

## 📋 响应数据结构

创建成功后返回的字段数据：

```typescript
{
  id: 'fldXXXXXXXXXXXXXXXX',
  name: '状态',
  type: 'singleSelect',
  description: '任务当前状态',
  options: {
    choices: [
      {
        id: 'cho_todo',
        name: '待处理',
        color: 'yellow'
      },
      {
        id: 'cho_doing',
        name: '进行中',
        color: 'blue'
      },
      {
        id: 'cho_done',
        name: '已完成',
        color: 'green'
      }
    ],
    defaultValue: '待处理',
    preventAutoNewOptions: false
  },
  dbFieldName: 'fldXXXXXXXXXXXXXXXX',
  dbFieldType: 'text',             // 数据库中存储为 text 类型
  cellValueType: 'string',         // 单元格值类型
  isMultipleCellValue: false,      // 不是多值
  isComputed: false,               // 不是计算字段
  isPrimary: false,
  notNull: false,
  unique: false,
  order: 0,
  createdTime: '2025-10-24T...',
  lastModifiedTime: '2025-10-24T...'
}
```

---

## 🔐 权限要求

- 需要 `field|create` 权限
- 必须是表格的协作者或所有者

---

## 🧪 测试建议

### 测试 1：创建空选项单选字段
```typescript
const field = await createField(tableId, {
  type: 'singleSelect',
  name: '测试字段',
  options: { choices: [] }
});
```

### 测试 2：创建带选项的单选字段
```typescript
const field = await createField(tableId, {
  type: 'singleSelect',
  name: '状态',
  options: {
    choices: [
      { name: 'A' },
      { name: 'B' },
      { name: 'C' }
    ]
  }
});
```

### 测试 3：验证选项名称唯一性
```typescript
// 这会失败 - 选项名称重复
const field = await createField(tableId, {
  type: 'singleSelect',
  name: '测试',
  options: {
    choices: [
      { name: '选项1' },
      { name: '选项1' }  // ❌ 重复的名称
    ]
  }
});
```

---

## 📚 相关代码位置

- **API 路由**: `packages/openapi/src/field/create.ts`
- **Schema 定义**: `packages/core/src/models/field/derivate/abstract/select.field.abstract.ts`
- **颜色枚举**: `packages/core/src/models/field/colors.ts`
- **Controller**: `apps/nestjs-backend/src/features/field/open-api/field-open-api.controller.ts`
- **测试用例**: 
  - `apps/nestjs-backend/test/field.e2e-spec.ts`
  - `apps/nestjs-backend/test/data-helpers/20x.ts`

---

## 🆚 单选 vs 多选字段

| 特性 | 单选 (SingleSelect) | 多选 (MultipleSelect) |
|------|---------------------|----------------------|
| 类型值 | `'singleSelect'` | `'multipleSelect'` |
| 单元格值类型 | `string` | `string[]` |
| 单元格值示例 | `'选项A'` | `['选项A', '选项B']` |
| isMultipleCellValue | `false` | `true` |
| 数据库存储 | 直接存字符串 | JSON 数组字符串 |

### 多选字段创建示例

```typescript
{
  name: '标签',
  type: 'multipleSelect',  // 注意这里是 multipleSelect
  options: {
    choices: [
      { name: '重要', color: 'red' },
      { name: '紧急', color: 'orange' },
      { name: '待办', color: 'blue' }
    ],
    defaultValue: ['待办']  // 多选的默认值是数组
  }
}
```

---

## 💡 最佳实践

### 1. 选项命名
- ✅ 使用简短清晰的名称
- ✅ 避免使用特殊字符
- ✅ 保持命名风格一致

### 2. 颜色选择
- ✅ 同一语义使用相同颜色系（如所有"完成"用绿色）
- ✅ 重要/紧急状态用醒目颜色（红色、橙色）
- ✅ 正常/中性状态用中性颜色（蓝色、灰色）

### 3. 选项数量
- ✅ 建议不超过 20 个选项（太多影响用户体验）
- ✅ 超过 20 个考虑使用多级分类或搜索功能

### 4. 默认值设置
- ✅ 为新记录设置合理的默认值
- ✅ 默认值应该是最常用的选项

### 5. 自动创建选项
- ✅ 开发/测试环境：`preventAutoNewOptions: false`（允许灵活添加）
- ✅ 生产环境：`preventAutoNewOptions: true`（防止意外添加）

---

## 🔍 常见错误

### 错误 1：选项名称为空
```typescript
// ❌ 错误
choices: [
  { name: '', color: 'blue' }
]

// ✅ 正确
choices: [
  { name: '未命名', color: 'blue' }
]
```

### 错误 2：defaultValue 不存在
```typescript
// ❌ 错误
{
  choices: [
    { name: 'A' },
    { name: 'B' }
  ],
  defaultValue: 'C'  // C 不在 choices 中
}

// ✅ 正确
{
  choices: [
    { name: 'A' },
    { name: 'B' }
  ],
  defaultValue: 'A'  // A 存在于 choices 中
}
```

### 错误 3：颜色值不正确
```typescript
// ❌ 错误
{ name: '选项', color: 'red-500' }  // 不是有效的颜色值
{ name: '选项', color: '#FF0000' }   // 不支持十六进制颜色

// ✅ 正确
{ name: '选项', color: 'red' }       // 使用 Colors 枚举值
{ name: '选项', color: 'redBright' }
```

---

## 🎓 实战案例

### 案例：项目管理系统的状态字段

```typescript
import { createField, updateRecord } from '@teable/openapi';
import { FieldType, Colors } from '@teable/core';

// 1. 创建项目状态字段
const projectStatusField = await createField(projectTableId, {
  name: '项目状态',
  type: FieldType.SingleSelect,
  description: '当前项目所处的阶段',
  options: {
    choices: [
      { id: 'cho_planning', name: '规划中', color: Colors.Gray },
      { id: 'cho_design', name: '设计中', color: Colors.Purple },
      { id: 'cho_dev', name: '开发中', color: Colors.Blue },
      { id: 'cho_testing', name: '测试中', color: Colors.Cyan },
      { id: 'cho_deployed', name: '已上线', color: Colors.Green },
      { id: 'cho_maintenance', name: '维护中', color: Colors.Yellow },
      { id: 'cho_archived', name: '已归档', color: Colors.GrayDark1 }
    ],
    defaultValue: '规划中',
    preventAutoNewOptions: true  // 不允许随意添加状态
  }
});

// 2. 设置记录的状态
await updateRecord(projectTableId, recordId, {
  fieldKeyType: 'id',
  record: {
    fields: {
      [projectStatusField.id]: '开发中'
    }
  }
});

// 3. 批量更新多个记录的状态
await updateRecords(projectTableId, {
  fieldKeyType: 'id',
  records: [
    {
      id: 'rec001',
      fields: { [projectStatusField.id]: '测试中' }
    },
    {
      id: 'rec002',
      fields: { [projectStatusField.id]: '已上线' }
    }
  ]
});
```

---

## 📖 相关文档

- [字段类型转换 API](./API_FIELD_CONVERSION_GUIDE.md)
- [颜色定义](../packages/core/src/models/field/colors.ts)
- [Schema 定义](../packages/core/src/models/field/derivate/abstract/select.field.abstract.ts)

