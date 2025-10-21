import type { IDepartmentCellValue } from '@teable/core';
import { DepartmentFieldCore } from '@teable/core';
import type { FieldBase } from '../field-base';

export class DepartmentFieldDto extends DepartmentFieldCore implements FieldBase {
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

    const parsedValue: IDepartmentCellValue =
      typeof value === 'string' ? JSON.parse(value) : value;
    return parsedValue;
  }
}

