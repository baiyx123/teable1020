import { z } from 'zod';
import { CellValueType, DbFieldType, FieldType } from '../constant';
import { FieldCore } from '../field';

export const createdByDepartmentFieldOptionsSchema = z.object({}).strict();

export type ICreatedByDepartmentFieldOptions = z.infer<
  typeof createdByDepartmentFieldOptionsSchema
>;

export interface ICreatedByDepartmentCellValue {
  id: string;
  name: string;
  code: string;
  path?: string;
}

export class CreatedByDepartmentFieldCore extends FieldCore {
  type!: FieldType.CreatedByDepartment;

  cellValueType = CellValueType.String;

  dbFieldType = DbFieldType.Json;

  isComputed = true;  // 计算字段，自动填充，不可手动编辑

  options!: ICreatedByDepartmentFieldOptions;

  item2String(value?: unknown): string {
    if (!value) return '';
    const dept = value as ICreatedByDepartmentCellValue;
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
    return createdByDepartmentFieldOptionsSchema.safeParse(this.options);
  }

  validateCellValue(value: unknown) {
    return { success: true, data: value } as any;
  }

  eq(value: unknown, other: unknown): boolean {
    if (!value || !other) return value === other;
    const v1 = value as ICreatedByDepartmentCellValue;
    const v2 = other as ICreatedByDepartmentCellValue;
    return v1.id === v2.id;
  }
}

