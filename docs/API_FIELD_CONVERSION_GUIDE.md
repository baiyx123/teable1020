# Teable 字段类型转换 API 指南

## 📚 将文本字段修改为公式字段

### API 端点

```
PUT /api/table/{tableId}/field/{fieldId}/convert
```

### 请求结构

```typescript
// 请求头
Headers: {
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  'Content-Type': 'application/json',
  'x-window-id': 'WINDOW_ID' // 可选
}

// URL 参数
{
  tableId: 'tblxxxxxxxxxxxxx',  // 表格 ID
  fieldId: 'fldxxxxxxxxxxxxx'   // 要转换的字段 ID
}

// 请求体
{
  type: 'formula',               // 新的字段类型
  options: {
    expression: '你的公式表达式',  // 公式内容
    timeZone: 'Asia/Shanghai',   // 可选：时区（日期公式需要）
    formatting: {                // 可选：格式化选项
      type: 'decimal',
      precision: 2
    }
  }
}
```

### 完整示例

#### 示例 1：将文本字段转换为简单公式

```bash
curl -X PUT \
  'http://localhost:3000/api/table/tbl123456/field/fld987654/convert' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "type": "formula",
    "options": {
      "expression": "1 + 1"
    }
  }'
```

**结果**：字段转换为公式类型，所有行显示 `2`

---

#### 示例 2：将文本字段转换为引用其他字段的公式

假设你有：
- 文本字段 A (fld_text_001)
- 数字字段 B (fld_number_002)

```bash
curl -X PUT \
  'http://localhost:3000/api/table/tbl123456/field/fld_text_001/convert' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "type": "formula",
    "options": {
      "expression": "{fld_number_002} * 2"
    }
  }'
```

**注意**：
- 公式中引用字段使用 `{fieldId}` 格式
- fieldId 是实际的字段 ID（如 `fld_number_002`）

---

#### 示例 3：文本拼接公式

```javascript
{
  "type": "formula",
  "options": {
    "expression": "{fldTextFieldId} & ' - ' & {fldNumberFieldId}"
  }
}
```

这会将两个字段的值拼接起来，例如：`Hello - 123`

---

#### 示例 4：条件公式

```javascript
{
  "type": "formula",
  "options": {
    "expression": "IF({fldNumberFieldId} > 100, '大于100', '小于等于100')"
  }
}
```

---

#### 示例 5：日期公式（需要时区）

```javascript
{
  "type": "formula",
  "options": {
    "expression": "TODAY()",
    "timeZone": "Asia/Shanghai",
    "formatting": {
      "date": "YYYY-MM-DD",
      "time": "None",
      "timeZone": "Asia/Shanghai"
    }
  }
}
```

---

## 🔍 预览转换计划（推荐先调用）

在实际转换之前，可以先调用计划 API 预览转换结果：

### 端点

```
PUT /api/plan/table/{tableId}/field/{fieldId}/convert
```

### 请求示例

```bash
curl -X PUT \
  'http://localhost:3000/api/plan/table/tbl123456/field/fld987654/convert' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "type": "formula",
    "options": {
      "expression": "1 + 1"
    }
  }'
```

### 响应示例

```json
{
  "updateCellCount": 100,      // 受影响的单元格数量
  "skip": false,               // 是否可以跳过转换
  "graph": {                   // 依赖关系图
    "nodes": [...],
    "edges": [...],
    "combos": [...]
  }
}
```

---

## 📋 完整的 TypeScript 代码示例

### 使用 SDK

```typescript
import { convertField } from '@teable/openapi';

// 将文本字段转换为公式字段
async function convertTextToFormula(
  tableId: string, 
  textFieldId: string,
  formulaExpression: string
) {
  try {
    const result = await convertField(tableId, textFieldId, {
      type: 'formula',
      options: {
        expression: formulaExpression
      }
    });
    
    console.log('转换成功:', result);
    return result;
  } catch (error) {
    console.error('转换失败:', error);
    throw error;
  }
}

// 使用示例
convertTextToFormula(
  'tblXXXXXXXXXXXXXXXX',
  'fldYYYYYYYYYYYYYYYY',
  '1 + 1'
);
```

### 引用其他字段的公式

```typescript
// 假设有两个字段
const priceFieldId = 'fldPriceField123';
const quantityFieldId = 'fldQuantityFld456';
const textFieldId = 'fldTextFieldXXX';

// 将文本字段转换为计算总价的公式
await convertField(tableId, textFieldId, {
  type: 'formula',
  options: {
    expression: `{${priceFieldId}} * {${quantityFieldId}}`
  }
});
```

---

## 🎯 公式语法参考

### 常用函数

#### 1. 数学运算
```javascript
expression: "{fieldId1} + {fieldId2}"      // 加法
expression: "{fieldId1} - {fieldId2}"      // 减法
expression: "{fieldId1} * {fieldId2}"      // 乘法
expression: "{fieldId1} / {fieldId2}"      // 除法
```

#### 2. 文本操作
```javascript
expression: "{fieldId1} & {fieldId2}"      // 拼接
expression: "LEFT({fieldId}, 5)"           // 左侧5个字符
expression: "RIGHT({fieldId}, 3)"          // 右侧3个字符
expression: "UPPER({fieldId})"             // 转大写
expression: "LOWER({fieldId})"             // 转小写
```

#### 3. 条件判断
```javascript
expression: "IF({price} > 100, '贵', '便宜')"
expression: "IF(AND({field1}, {field2}), '是', '否')"
expression: "IF(OR({field1}, {field2}), '是', '否')"
```

#### 4. 日期函数
```javascript
expression: "TODAY()"                      // 今天
expression: "NOW()"                        // 现在
expression: "YEAR({dateField})"            // 获取年份
expression: "MONTH({dateField})"           // 获取月份
expression: "DAY({dateField})"             // 获取日期
```

#### 5. 聚合函数
```javascript
expression: "SUM({numberField})"           // 求和
expression: "AVERAGE({numberField})"       // 平均值
expression: "MAX({numberField})"           // 最大值
expression: "MIN({numberField})"           // 最小值
```

---

## ⚠️ 重要注意事项

### 1. 字段引用格式
- ✅ 正确：`{fldXXXXXXXXXXXXXXXX}` （使用字段 ID）
- ❌ 错误：`{字段名称}` （不能直接用名称）

### 2. 转换限制
- 公式字段是**只读**的，不能手动编辑
- 转换后原有数据会被公式计算结果覆盖
- 某些类型转换可能导致数据丢失（建议先调用 plan API 预览）

### 3. 字段类型对应的 options

```typescript
// 不同字段类型需要的 options

// 文本字段
{ type: 'singleLineText', options: {} }

// 公式字段
{ 
  type: 'formula', 
  options: { 
    expression: 'YOUR_FORMULA'
  } 
}

// 数字字段
{ 
  type: 'number', 
  options: {
    formatting: { 
      type: 'decimal', 
      precision: 2 
    }
  } 
}

// 单选字段
{ 
  type: 'singleSelect', 
  options: {
    choices: [
      { name: 'Option 1', color: 'blue' },
      { name: 'Option 2', color: 'red' }
    ]
  } 
}
```

---

## 🧪 测试代码参考

以下是项目中的实际测试代码：

```typescript
// 来自: apps/nestjs-backend/test/field-converting.e2e-spec.ts:807

it('should convert text to formula', async () => {
  const sourceFieldRo: IFieldRo = {
    type: FieldType.SingleLineText,
  };
  
  const newFieldRo: IFieldRo = {
    type: FieldType.Formula,
    options: {
      expression: '1',
    },
  };
  
  const { newField, values } = await expectUpdate(
    table1, 
    sourceFieldRo, 
    newFieldRo, 
    ['x', null]  // 原始数据
  );
  
  expect(newField).toMatchObject({
    cellValueType: CellValueType.Number,
    dbFieldType: DbFieldType.Real,
    type: FieldType.Formula,
    isComputed: true,
  });
  
  expect(values[0]).toEqual(1);  // 'x' 被公式结果 1 替换
  expect(values[1]).toEqual(1);  // null 被公式结果 1 替换
});
```

---

## 🔗 使用 Axios 调用

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';
const TOKEN = 'your_access_token';

async function convertTextFieldToFormula(
  tableId: string,
  fieldId: string,
  formulaExpression: string
) {
  const response = await axios.put(
    `${API_BASE}/table/${tableId}/field/${fieldId}/convert`,
    {
      type: 'formula',
      options: {
        expression: formulaExpression
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data;
}

// 使用示例
const result = await convertTextFieldToFormula(
  'tblXXXXXXXXXXXXXXXX',
  'fldYYYYYYYYYYYYYYYY',
  '1 + 1'
);

console.log('转换后的字段:', result);
```

---

## 📊 完整流程示例

### 场景：将"价格"文本字段改为公式（单价 × 数量）

```typescript
// 1. 获取字段信息
const fields = await getFields(tableId);
const priceTextField = fields.find(f => f.name === '总价');
const unitPriceField = fields.find(f => f.name === '单价');
const quantityField = fields.find(f => f.name === '数量');

// 2. 预览转换计划（可选但推荐）
const plan = await axios.put(
  `/api/plan/table/${tableId}/field/${priceTextField.id}/convert`,
  {
    type: 'formula',
    options: {
      expression: `{${unitPriceField.id}} * {${quantityField.id}}`
    }
  }
);

console.log(`将影响 ${plan.data.updateCellCount} 个单元格`);

// 3. 执行转换
const result = await axios.put(
  `/api/table/${tableId}/field/${priceTextField.id}/convert`,
  {
    type: 'formula',
    options: {
      expression: `{${unitPriceField.id}} * {${quantityField.id}}`,
      formatting: {
        type: 'decimal',
        precision: 2  // 保留2位小数
      }
    }
  }
);

console.log('转换成功:', result.data);
```

---

## 🎨 常见转换场景

### 1. 文本 → 固定值公式
```json
{
  "type": "formula",
  "options": {
    "expression": "\"固定文本\""
  }
}
```

### 2. 文本 → 数值计算公式
```json
{
  "type": "formula",
  "options": {
    "expression": "100 * 1.2",
    "formatting": {
      "type": "decimal",
      "precision": 2
    }
  }
}
```

### 3. 文本 → 字段引用公式
```json
{
  "type": "formula",
  "options": {
    "expression": "{fldPriceField123} * {fldQuantityFld456}"
  }
}
```

### 4. 文本 → 字符串拼接公式
```json
{
  "type": "formula",
  "options": {
    "expression": "{fldFirstName} & \" \" & {fldLastName}"
  }
}
```

### 5. 文本 → 条件判断公式
```json
{
  "type": "formula",
  "options": {
    "expression": "IF({fldScore} >= 60, \"及格\", \"不及格\")"
  }
}
```

### 6. 文本 → 日期公式
```json
{
  "type": "formula",
  "options": {
    "expression": "TODAY()",
    "timeZone": "Asia/Shanghai",
    "formatting": {
      "date": "YYYY-MM-DD",
      "time": "None",
      "timeZone": "Asia/Shanghai"
    }
  }
}
```

---

## 📝 字段类型枚举

```typescript
enum FieldType {
  SingleLineText = 'singleLineText',
  LongText = 'longText',
  Number = 'number',
  SingleSelect = 'singleSelect',
  MultipleSelect = 'multipleSelect',
  Date = 'date',
  Checkbox = 'checkbox',
  Rating = 'rating',
  Formula = 'formula',        // 公式字段
  Rollup = 'rollup',
  Link = 'link',
  Attachment = 'attachment',
  User = 'user',
  AutoNumber = 'autoNumber',
  CreatedTime = 'createdTime',
  LastModifiedTime = 'lastModifiedTime',
  CreatedBy = 'createdBy',
  LastModifiedBy = 'lastModifiedBy',
  Button = 'button'
}
```

---

## 🛠️ 响应数据结构

成功转换后会返回更新后的字段信息：

```typescript
{
  id: 'fldXXXXXXXXXXXXXXXX',
  name: '字段名称',
  type: 'formula',
  options: {
    expression: '1 + 1',
    formatting: { ... }
  },
  cellValueType: 'number',      // 单元格值类型
  dbFieldType: 'real',          // 数据库字段类型
  isComputed: true,             // 是否为计算字段
  hasError: false,              // 是否有错误
  isPrimary: false,
  notNull: false,
  unique: false,
  order: 0,
  createdTime: '...',
  lastModifiedTime: '...'
}
```

---

## ⚡ 使用 Teable SDK

```typescript
import { convertField } from '@teable/openapi';

// 最简单的方式
const updatedField = await convertField(
  'tblXXXXXXXXXXXXXXXX',  // tableId
  'fldYYYYYYYYYYYYYYYY',  // fieldId
  {
    type: 'formula',
    options: {
      expression: '{fldPriceField} * {fldQtyField}'
    }
  }
);
```

---

## 🔐 权限要求

- 需要 `field|update` 权限
- 必须是表格的协作者或所有者

---

## 📚 相关代码位置

- **API 路由定义**: `packages/openapi/src/field/convert.ts`
- **Controller**: `apps/nestjs-backend/src/features/field/open-api/field-open-api.controller.ts`
- **Service**: `apps/nestjs-backend/src/features/field/open-api/field-open-api.service.ts`
- **Schema 定义**: `packages/core/src/models/field/field.schema.ts`
- **公式字段 Options**: `packages/core/src/models/field/derivate/formula.field.ts`
- **测试用例**: `apps/nestjs-backend/test/field-converting.e2e-spec.ts`

---

## 🧪 测试验证

可以参考项目中的 e2e 测试：

- `apps/nestjs-backend/test/field-converting.e2e-spec.ts` (第807行)
- `apps/nestjs-backend/test/formula.e2e-spec.ts`
- `apps/nestjs-backend/test/graph.e2e-spec.ts` (第184行)

这些测试展示了各种字段转换的实际用法。

