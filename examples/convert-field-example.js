#!/usr/bin/env node

/**
 * Teable 字段转换示例
 * 演示如何将文本字段转换为公式字段
 */

const axios = require('axios');

// ====== 配置 ======
const API_BASE = 'http://localhost:3000/api';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';  // 替换为你的访问令牌

// ====== 示例参数 ======
const TABLE_ID = 'tblXXXXXXXXXXXXXXXX';  // 替换为你的表格 ID
const FIELD_ID = 'fldYYYYYYYYYYYYYYYY';  // 替换为要转换的字段 ID

// ====== HTTP 客户端配置 ======
const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

/**
 * 示例 1: 将文本字段转换为简单数值公式
 */
async function example1_simpleNumberFormula() {
  console.log('\n=== 示例 1: 简单数值公式 ===');
  
  try {
    const response = await client.put(
      `/table/${TABLE_ID}/field/${FIELD_ID}/convert`,
      {
        type: 'formula',
        options: {
          expression: '1 + 1',
          formatting: {
            type: 'decimal',
            precision: 0
          }
        }
      }
    );
    
    console.log('✓ 转换成功!');
    console.log('字段类型:', response.data.type);
    console.log('公式表达式:', response.data.options.expression);
    console.log('结果:', '所有单元格显示: 2');
    
    return response.data;
  } catch (error) {
    console.error('✗ 转换失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 示例 2: 引用其他字段的公式
 */
async function example2_referenceFields(priceFieldId, quantityFieldId) {
  console.log('\n=== 示例 2: 引用字段计算总价 ===');
  console.log(`公式: {${priceFieldId}} * {${quantityFieldId}}`);
  
  try {
    const response = await client.put(
      `/table/${TABLE_ID}/field/${FIELD_ID}/convert`,
      {
        type: 'formula',
        options: {
          expression: `{${priceFieldId}} * {${quantityFieldId}}`,
          formatting: {
            type: 'decimal',
            precision: 2
          }
        }
      }
    );
    
    console.log('✓ 转换成功!');
    console.log('公式:', response.data.options.expression);
    
    return response.data;
  } catch (error) {
    console.error('✗ 转换失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 示例 3: 文本拼接公式
 */
async function example3_textConcatenation(firstNameFieldId, lastNameFieldId) {
  console.log('\n=== 示例 3: 文本拼接公式 ===');
  console.log(`公式: {${firstNameFieldId}} & " " & {${lastNameFieldId}}`);
  
  try {
    const response = await client.put(
      `/table/${TABLE_ID}/field/${FIELD_ID}/convert`,
      {
        type: 'formula',
        options: {
          expression: `{${firstNameFieldId}} & " " & {${lastNameFieldId}}`
        }
      }
    );
    
    console.log('✓ 转换成功!');
    console.log('结果示例: 张三 (如果名=张，姓=三)');
    
    return response.data;
  } catch (error) {
    console.error('✗ 转换失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 示例 4: 条件公式
 */
async function example4_conditionalFormula(scoreFieldId) {
  console.log('\n=== 示例 4: 条件判断公式 ===');
  console.log(`公式: IF({${scoreFieldId}} >= 60, "及格", "不及格")`);
  
  try {
    const response = await client.put(
      `/table/${TABLE_ID}/field/${FIELD_ID}/convert`,
      {
        type: 'formula',
        options: {
          expression: `IF({${scoreFieldId}} >= 60, "及格", "不及格")`
        }
      }
    );
    
    console.log('✓ 转换成功!');
    console.log('逻辑: 分数 >= 60 显示"及格"，否则显示"不及格"');
    
    return response.data;
  } catch (error) {
    console.error('✗ 转换失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 示例 5: 日期公式
 */
async function example5_dateFormula() {
  console.log('\n=== 示例 5: 日期公式 ===');
  console.log('公式: TODAY()');
  
  try {
    const response = await client.put(
      `/table/${TABLE_ID}/field/${FIELD_ID}/convert`,
      {
        type: 'formula',
        options: {
          expression: 'TODAY()',
          timeZone: 'Asia/Shanghai',
          formatting: {
            date: 'YYYY-MM-DD',
            time: 'None',
            timeZone: 'Asia/Shanghai'
          }
        }
      }
    );
    
    console.log('✓ 转换成功!');
    console.log('结果: 显示当前日期');
    
    return response.data;
  } catch (error) {
    console.error('✗ 转换失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 预览转换计划（在实际转换前调用）
 */
async function previewConversion(tableId, fieldId, newFieldConfig) {
  console.log('\n=== 预览转换计划 ===');
  
  try {
    const response = await client.put(
      `/plan/table/${tableId}/field/${fieldId}/convert`,
      newFieldConfig
    );
    
    console.log('✓ 预览成功!');
    console.log('受影响的单元格数:', response.data.updateCellCount);
    console.log('是否可跳过:', response.data.skip || false);
    console.log('依赖关系:', response.data.graph ? '存在字段依赖' : '无依赖');
    
    return response.data;
  } catch (error) {
    console.error('✗ 预览失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 获取表格所有字段
 */
async function getFields(tableId) {
  try {
    const response = await client.get(`/table/${tableId}/field`);
    return response.data;
  } catch (error) {
    console.error('获取字段失败:', error.response?.data || error.message);
    throw error;
  }
}

// ====== 主函数 ======
async function main() {
  console.log('========================================');
  console.log('  Teable 字段转换示例');
  console.log('========================================');
  
  // 检查配置
  if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN_HERE') {
    console.error('\n❌ 请先配置 ACCESS_TOKEN');
    console.log('\n如何获取访问令牌:');
    console.log('1. 登录 Teable');
    console.log('2. 进入设置 → Personal Access Token');
    console.log('3. 创建新令牌并复制');
    process.exit(1);
  }
  
  if (TABLE_ID.includes('XXX')) {
    console.error('\n❌ 请先配置正确的 TABLE_ID 和 FIELD_ID');
    console.log('\n如何获取 ID:');
    console.log('1. 在浏览器中打开表格');
    console.log('2. URL 中的 tableId 和 字段设置中的 fieldId');
    process.exit(1);
  }
  
  try {
    // 示例：先预览转换
    console.log('\n步骤1: 预览转换');
    await previewConversion(TABLE_ID, FIELD_ID, {
      type: 'formula',
      options: {
        expression: '1 + 1'
      }
    });
    
    // 示例：执行简单数值公式转换
    console.log('\n步骤2: 执行转换');
    await example1_simpleNumberFormula();
    
    console.log('\n========================================');
    console.log('  ✓ 示例执行完成');
    console.log('========================================');
    
    // 其他示例（取消注释使用）:
    // await example2_referenceFields('fldPrice123', 'fldQty456');
    // await example3_textConcatenation('fldFirstName', 'fldLastName');
    // await example4_conditionalFormula('fldScore123');
    // await example5_dateFormula();
    
  } catch (error) {
    console.error('\n执行失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

// 导出函数供其他脚本使用
module.exports = {
  example1_simpleNumberFormula,
  example2_referenceFields,
  example3_textConcatenation,
  example4_conditionalFormula,
  example5_dateFormula,
  previewConversion,
  getFields
};

