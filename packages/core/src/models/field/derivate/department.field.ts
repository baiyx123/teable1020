import { z } from 'zod';
import { CellValueType, DbFieldType } from '../constant';
import type { FieldType } from '../constant';
import { FieldCore } from '../field';

// 部门字段选项
export const departmentFieldOptionsSchema = z.object({}).strict();

export type IDepartmentFieldOptions = z.infer<typeof departmentFieldOptionsSchema>;

// 部门字段值
export interface IDepartmentCellValue {
  id: string;
  name: string;
  code: string;
}

export const departmentCellValueSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export class DepartmentFieldCore extends FieldCore {
  type!: FieldType.Department;

  cellValueType = CellValueType.String;

  dbFieldType = DbFieldType.Json;

  options!: IDepartmentFieldOptions;

  isComputed = false;

  // 转换为字符串显示
  item2String(value?: unknown): string {
    if (!value) return '';
    const dept = value as IDepartmentCellValue;
    return `${dept.name} (${dept.code})`;
  }

  cellValue2String(value?: unknown): string {
    return this.item2String(value);
  }

  // 从字符串转换（用于导入）
  convertStringToCellValue(str: string): unknown {
    if (!str) return null;
    // 简单实现：暂不支持从字符串导入
    return null;
  }

  repair(value: unknown): unknown {
    if (!value) return null;

    // 验证格式
    if (typeof value === 'object' && value !== null) {
      const dept = value as Record<string, unknown>;
      if (
        typeof dept.id === 'string' &&
        typeof dept.name === 'string' &&
        typeof dept.code === 'string'
      ) {
        return {
          id: dept.id,
          name: dept.name,
          code: dept.code,
        };
      }
    }

    return null;
  }

  validateOptions() {
    return departmentFieldOptionsSchema.safeParse(this.options);
  }

  validateCellValue(value: unknown) {
    if (value === null || value === undefined) {
      return { success: true, data: null };
    }

    const schema = z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    });

    return schema.safeParse(value);
  }

  eq(value: unknown, other: unknown): boolean {
    if (!value || !other) return value === other;
    const v1 = value as IDepartmentCellValue;
    const v2 = other as IDepartmentCellValue;
    return v1.id === v2.id;
  }
}

