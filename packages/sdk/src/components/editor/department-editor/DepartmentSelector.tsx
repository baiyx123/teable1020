import type { IDepartmentCellValue } from '@teable/core';
import React, { useEffect, useState } from 'react';
import { useDepartments } from './hooks/useDepartments';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@teable/ui-lib/shadcn/ui/select';

interface Department {
  id: string;
  name: string;
  code: string;
  level: number;
  path?: string;
  status: string;
}

export interface IDepartmentSelectorProps {
  value?: string;
  onChange?: (value: string | null, dept?: IDepartmentCellValue) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DepartmentSelector: React.FC<IDepartmentSelectorProps> = (props) => {
  const { value, onChange, placeholder = '选择部门', disabled } = props;
  const { departments, loading } = useDepartments();
  const [selectedDept, setSelectedDept] = useState<Department | undefined>();

  useEffect(() => {
    if (value && departments.length > 0) {
      const dept = departments.find((d) => d.id === value);
      setSelectedDept(dept);
    }
  }, [value, departments]);

  const handleChange = (deptId: string) => {
    const dept = departments.find((d) => d.id === deptId);
    if (dept) {
      setSelectedDept(dept);
      onChange?.(deptId, {
        id: dept.id,
        name: dept.name,
        code: dept.code,
      });
    }
  };

  const handleClear = () => {
    setSelectedDept(undefined);
    onChange?.(null);
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled || loading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {selectedDept && (
            <span>
              {'　'.repeat(selectedDept.level - 1)}
              {selectedDept.name} ({selectedDept.code})
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {departments
          .filter((d) => d.status === 'active')
          .map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {'　'.repeat(dept.level - 1)}
              {dept.name} ({dept.code})
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

DepartmentSelector.displayName = 'DepartmentSelector';

