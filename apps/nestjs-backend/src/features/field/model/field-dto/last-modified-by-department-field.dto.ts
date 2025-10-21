import type { ILastModifiedByDepartmentCellValue } from '@teable/core';
import { LastModifiedByDepartmentFieldCore } from '@teable/core';
import type { FieldBase } from '../field-base';

export class LastModifiedByDepartmentFieldDto extends LastModifiedByDepartmentFieldCore implements FieldBase {
  get isStructuredCellValue() {
    return true;
  }

  convertCellValue2DBValue(value: unknown): unknown {
    if (!value) {
      return null;
    }
    return JSON.stringify(value);
  }

  convertDBValue2CellValue(value: unknown): unknown {
    if (value === null) return null;

    const parsedValue: ILastModifiedByDepartmentCellValue =
      typeof value === 'string' ? JSON.parse(value) : value;
    return parsedValue;
  }
}

