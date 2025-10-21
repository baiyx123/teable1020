import type { IDepartmentCellValue } from '@teable/core';
import React, { useCallback } from 'react';
import { DepartmentSelector } from './DepartmentSelector';

export interface IDepartmentEditorProps {
  value?: IDepartmentCellValue | null;
  onChange?: (value: IDepartmentCellValue | null) => void;
  readonly?: boolean;
}

export const DepartmentEditor: React.FC<IDepartmentEditorProps> = (props) => {
  const { value, onChange, readonly } = props;

  const handleChange = useCallback(
    (deptId: string | null, dept?: IDepartmentCellValue) => {
      if (!deptId) {
        onChange?.(null);
        return;
      }
      onChange?.(dept || null);
    },
    [onChange]
  );

  return (
    <div className="department-editor w-full">
      <DepartmentSelector
        value={value?.id}
        onChange={handleChange}
        disabled={readonly}
      />
    </div>
  );
};

DepartmentEditor.displayName = 'DepartmentEditor';

