#!/usr/bin/env node

/**
 * Teable 字段操作测试脚本
 * 用于测试单选字段创建和公式字段转换
 */

const https = require('https');
const http = require('http');

// ====== 配置信息 ======
const TEABLE_TOKEN = "teable_acclJEk4pc3WDzywrRl_hcpXy3tSAJcTUStdGJz0uZT74rzpTOIA/wnbZeukdm4=";
const TEABLE_BASE_ID = "bsewQso4GDsJoRyuFDA";
const BASE_URL = "https://app.teable.cn/api";
const TABLE_ID = "tblHlBZx5vTlUkPPM2p";

// ====== HTTP 客户端函数 ======

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${TEABLE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }
    
    const req = lib.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : null;
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          }
        } catch (e) {
          reject(new Error(`解析响应失败: ${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// ====== API 函数 ======

/**
 * 获取 Base 下的所有表格
 */
async function getTables(baseId) {
  try {
    const data = await request('GET', `/base/${baseId}/table`);
    console.log(`✓ 获取到 ${data.length} 个表格`);
    return data;
  } catch (error) {
    console.error('✗ 获取表格失败:', error.message);
    throw error;
  }
}

/**
 * 获取表格所有字段
 */
async function getFields(tableId) {
  try {
    const data = await request('GET', `/table/${tableId}/field`);
    console.log(`✓ 获取到 ${data.length} 个字段`);
    return data;
  } catch (error) {
    console.error('✗ 获取字段失败:', error.message);
    throw error;
  }
}

/**
 * 获取单个字段详情
 */
async function getField(tableId, fieldId) {
  try {
    const data = await request('GET', `/table/${tableId}/field/${fieldId}`);
    console.log(`✓ 获取字段成功: ${data.name}`);
    return data;
  } catch (error) {
    console.error('✗ 获取字段失败:', error.message);
    throw error;
  }
}

/**
 * 创建单选字段
 */
async function createSingleSelectField(tableId, name, choices, options = {}) {
  try {
    const data = await request('POST', `/table/${tableId}/field`, {
      name: name,
      type: 'singleSelect',
      description: options.description,
      options: {
        choices: choices,
        defaultValue: options.defaultValue,
        preventAutoNewOptions: options.preventAutoNewOptions || false
      }
    });
    
    console.log(`✓ 单选字段创建成功: ${data.name} (${data.id})`);
    console.log(`  选项数量: ${data.options.choices.length}`);
    
    return data;
  } catch (error) {
    console.error('✗ 创建单选字段失败:', error.message);
    throw error;
  }
}

/**
 * 创建公式字段
 */
async function createFormulaField(tableId, name, expression, options = {}) {
  try {
    const data = await request('POST', `/table/${tableId}/field`, {
      name: name,
      type: 'formula',
      description: options.description,
      options: {
        expression: expression,
        timeZone: options.timeZone,
        formatting: options.formatting
      }
    });
    
    console.log(`✓ 公式字段创建成功: ${data.name} (${data.id})`);
    console.log(`  公式: ${data.options.expression}`);
    
    return data;
  } catch (error) {
    console.error('✗ 创建公式字段失败:', error.message);
    throw error;
  }
}

/**
 * 将字段转换为公式字段
 */
async function convertToFormula(tableId, fieldId, expression, options = {}) {
  try {
    const data = await request('PUT', `/table/${tableId}/field/${fieldId}/convert`, {
      type: 'formula',
      options: {
        expression: expression,
        timeZone: options.timeZone,
        formatting: options.formatting
      }
    });
    
    console.log(`✓ 字段转换为公式成功: ${data.name}`);
    console.log(`  公式: ${data.options.expression}`);
    
    return data;
  } catch (error) {
    console.error('✗ 转换失败:', error.message);
    throw error;
  }
}

/**
 * 预览字段转换计划
 */
async function previewConversion(tableId, fieldId, newFieldConfig) {
  try {
    const data = await request('PUT', `/plan/table/${tableId}/field/${fieldId}/convert`, newFieldConfig);
    
    console.log(`✓ 转换计划预览成功`);
    console.log(`  影响单元格数: ${data.updateCellCount}`);
    console.log(`  是否可跳过: ${data.skip || false}`);
    
    return data;
  } catch (error) {
    console.error('✗ 预览失败:', error.message);
    throw error;
  }
}

/**
 * 获取表格记录
 */
async function getRecords(tableId, limit = 10) {
  try {
    const data = await request('GET', `/table/${tableId}/record?take=${limit}`);
    console.log(`✓ 获取到 ${data.records.length} 条记录`);
    return data.records;
  } catch (error) {
    console.error('✗ 获取记录失败:', error.message);
    throw error;
  }
}

/**
 * 删除字段
 */
async function deleteField(tableId, fieldId) {
  try {
    await request('DELETE', `/table/${tableId}/field/${fieldId}`);
    console.log(`✓ 字段删除成功`);
  } catch (error) {
    console.error('✗ 删除字段失败:', error.message);
    throw error;
  }
}

// ====== 测试用例 ======

/**
 * 测试 0: 查看 Base 下的所有表格
 */
async function test0_viewTables() {
  console.log('\n========================================');
  console.log('测试 0: 查看 Base 下的表格');
  console.log('========================================\n');
  
  const tables = await getTables(TEABLE_BASE_ID);
  
  console.log('\n表格列表:');
  tables.forEach((table, index) => {
    console.log(`${index + 1}. ${table.name} (${table.id})`);
    console.log(`   字段数: ${table.fields ? table.fields.length : '未知'}`);
  });
  
  return tables;
}

/**
 * 测试 1: 查看当前表格的所有字段
 */
async function test1_viewFields() {
  console.log('\n========================================');
  console.log('测试 1: 查看表格字段');
  console.log('========================================\n');
  
  const fields = await getFields(TABLE_ID);
  
  console.log('\n字段列表:');
  fields.forEach((field, index) => {
    console.log(`\n${index + 1}. ${field.name} (${field.id})`);
    console.log(`   类型: ${field.type}`);
    console.log(`   数据库类型: ${field.dbFieldType}`);
    if (field.options && field.options.choices) {
      console.log(`   选项: ${field.options.choices.map(c => c.name).join(', ')}`);
    }
    if (field.options && field.options.expression) {
      console.log(`   公式: ${field.options.expression}`);
    }
  });
  
  return fields;
}

/**
 * 测试 2: 创建单选字段
 */
async function test2_createSingleSelect() {
  console.log('\n========================================');
  console.log('测试 2: 创建单选字段');
  console.log('========================================\n');
  
  const choices = [
    { name: '待处理', color: 'yellow' },
    { name: '进行中', color: 'blue' },
    { name: '已完成', color: 'green' },
    { name: '已取消', color: 'red' }
  ];
  
  const field = await createSingleSelectField(
    TABLE_ID,
    '测试状态字段',
    choices,
    {
      description: 'API测试创建的状态字段',
      defaultValue: '待处理'
    }
  );
  
  console.log('\n创建的字段详情:');
  console.log('  ID:', field.id);
  console.log('  名称:', field.name);
  console.log('  类型:', field.type);
  console.log('  选项:', field.options.choices.map(c => `${c.name}(${c.color})`).join(', '));
  
  return field;
}

/**
 * 测试 3: 创建公式字段
 */
async function test3_createFormulaField() {
  console.log('\n========================================');
  console.log('测试 3: 创建公式字段');
  console.log('========================================\n');
  
  const field = await createFormulaField(
    TABLE_ID,
    '测试公式字段',
    '1 + 1',
    {
      description: 'API测试创建的公式字段',
      formatting: {
        type: 'decimal',
        precision: 0
      }
    }
  );
  
  console.log('\n创建的字段详情:');
  console.log('  ID:', field.id);
  console.log('  名称:', field.name);
  console.log('  公式:', field.options.expression);
  
  return field;
}

/**
 * 测试 4: 将现有字段转换为公式字段
 */
async function test4_convertToFormula(fieldId) {
  console.log('\n========================================');
  console.log('测试 4: 转换字段为公式');
  console.log('========================================\n');
  
  console.log(`字段ID: ${fieldId}`);
  
  // 先预览
  console.log('\n步骤 1: 预览转换计划...');
  const plan = await previewConversion(TABLE_ID, fieldId, {
    type: 'formula',
    options: {
      expression: '"测试公式"'
    }
  });
  
  console.log('  影响单元格数:', plan.updateCellCount);
  
  // 执行转换
  console.log('\n步骤 2: 执行转换...');
  const result = await convertToFormula(TABLE_ID, fieldId, '"测试公式"');
  
  return result;
}

/**
 * 测试 5: 创建引用其他字段的公式
 */
async function test5_createFormulaWithReference() {
  console.log('\n========================================');
  console.log('测试 5: 创建引用字段的公式');
  console.log('========================================\n');
  
  // 先获取所有字段
  const fields = await getFields(TABLE_ID);
  
  console.log('\n可用字段:');
  fields.forEach((field, index) => {
    console.log(`${index + 1}. ${field.name} (${field.id}) - ${field.type}`);
  });
  
  // 找一个文本或数字字段来引用
  const textOrNumberField = fields.find(
    f => f.type === 'singleLineText' || f.type === 'number'
  );
  
  if (!textOrNumberField) {
    console.log('\n⚠ 未找到可引用的文本或数字字段');
    return null;
  }
  
  console.log(`\n使用字段: ${textOrNumberField.name} (${textOrNumberField.id})`);
  
  const field = await createFormulaField(
    TABLE_ID,
    '引用公式测试',
    `"前缀-" & {${textOrNumberField.id}}`,
    {
      description: '引用其他字段的公式示例'
    }
  );
  
  return field;
}

/**
 * 测试 6: 查看记录数据
 */
async function test6_viewRecords() {
  console.log('\n========================================');
  console.log('测试 6: 查看记录数据');
  console.log('========================================\n');
  
  const records = await getRecords(TABLE_ID, 5);
  
  console.log('\n前5条记录:');
  records.forEach((record, index) => {
    console.log(`\n记录 ${index + 1} (${record.id}):`);
    const fieldCount = Object.keys(record.fields).length;
    console.log(`  包含 ${fieldCount} 个字段`);
    
    // 只显示前3个字段的数据
    let count = 0;
    for (const [fieldId, value] of Object.entries(record.fields)) {
      if (count++ >= 3) {
        console.log(`  ... 还有 ${fieldCount - 3} 个字段`);
        break;
      }
      const displayValue = typeof value === 'string' && value.length > 50 
        ? value.substring(0, 50) + '...' 
        : JSON.stringify(value);
      console.log(`  ${fieldId}: ${displayValue}`);
    }
  });
  
  return records;
}

// ====== 主函数 ======
async function main() {
  console.log('========================================');
  console.log('  Teable 字段 API 测试');
  console.log('========================================');
  console.log('BASE URL:', BASE_URL);
  console.log('Base ID:', TEABLE_BASE_ID);
  console.log('Table ID:', TABLE_ID);
  console.log('========================================\n');
  
  try {
    // 测试 0: 先查看有哪些表格
    await test0_viewTables();
    
    // 测试 1: 查看现有字段
    const fields = await test1_viewFields();
    
    // 询问用户要执行哪个测试
    console.log('\n\n========================================');
    console.log('可用的测试（取消注释来运行）:');
    console.log('========================================');
    console.log('2. 创建单选字段 - await test2_createSingleSelect()');
    console.log('3. 创建公式字段 - await test3_createFormulaField()');
    console.log('4. 转换字段为公式 - await test4_convertToFormula(fieldId)');
    console.log('5. 创建引用字段的公式 - await test5_createFormulaWithReference()');
    console.log('6. 查看记录数据 - await test6_viewRecords()');
    console.log('\n编辑脚本取消注释来运行更多测试');
    
    // 取消下面的注释来运行对应的测试：
    
    // await test2_createSingleSelect();
    
    // await test3_createFormulaField();
    
    // 替换为实际字段ID：
    // await test4_convertToFormula('fldXXXXXXXXXXXXXXXX');
    
    // await test5_createFormulaWithReference();
    
    // await test6_viewRecords();
    
    console.log('\n✓ 测试完成');
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main();
}

// 导出函数供其他脚本使用
module.exports = {
  getTables,
  getFields,
  getField,
  createSingleSelectField,
  createFormulaField,
  convertToFormula,
  previewConversion,
  getRecords,
  deleteField,
  test0_viewTables,
  test1_viewFields,
  test2_createSingleSelect,
  test3_createFormulaField,
  test4_convertToFormula,
  test5_createFormulaWithReference,
  test6_viewRecords
};
