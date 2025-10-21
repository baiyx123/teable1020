import { z } from 'zod';
import { CellValueType, DbFieldType, FieldType } from '../constant';
import { FieldCore } from '../field';

export const lastModifiedByDepartmentFieldOptionsSchema = z.object({}).strict();

export type ILastModifiedByDepartmentFieldOptions = z.infer<
  typeof lastModifiedByDepartmentFieldOptionsSchema
>;

export interface ILastModifiedByDepartmentCellValue {
  id: string;
  name: string;
  code: string;
  path?: string;
}

export class LastModifiedByDepartmentFieldCore extends FieldCore {
  type!: FieldType.LastModifiedByDepartment;

  cellValueType = CellValueType.String;

  dbFieldType = DbFieldType.Json;

  isComputed = true;  // 计算字段，自动填充，不可手动编辑

  options!: ILastModifiedByDepartmentFieldOptions;

  item2String(value?: unknown): string {
    if (!value) return '';
    const dept = value as ILastModifiedByDepartmentCellValue;
    return `${dept.name} (${dept.code})`;
  }

  cellValue2String(value?: unknown): string {
    return this.item2String(value);
  }

  convertStringToCellValue(_value: string): unknown {
    return null;  // 计算字段不支持从字符串转换
  }

  repair(_value: unknown): unknown {
    return null;  // 计算字段不支持修复
  }

  validateOptions() {
    return lastModifiedByDepartmentFieldOptionsSchema.safeParse(this.options);
  }

  validateCellValue(value: unknown) {
    return { success: true, data: value } as any;
  }

  eq(value: unknown, other: unknown): boolean {
    if (!value || !other) return value === other;
    const v1 = value as ILastModifiedByDepartmentCellValue;
    const v2 = other as ILastModifiedByDepartmentCellValue;
    return v1.id === v2.id;
  }
}

