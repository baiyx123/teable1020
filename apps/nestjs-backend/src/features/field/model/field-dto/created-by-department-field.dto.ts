import type { ICreatedByDepartmentCellValue } from '@teable/core';
import { CreatedByDepartmentFieldCore } from '@teable/core';
import type { FieldBase } from '../field-base';

export class CreatedByDepartmentFieldDto extends CreatedByDepartmentFieldCore implements FieldBase {
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

    const parsedValue: ICreatedByDepartmentCellValue =
      typeof value === 'string' ? JSON.parse(value) : value;
    return parsedValue;
  }
}

