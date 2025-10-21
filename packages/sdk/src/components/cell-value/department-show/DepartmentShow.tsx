import type { IDepartmentCellValue } from '@teable/core';
import React from 'react';
import { cn } from '@teable/ui-lib/shadcn';

export interface IDepartmentShowProps {
  value?: IDepartmentCellValue | null;
  className?: string;
}

export const DepartmentShow: React.FC<IDepartmentShowProps> = (props) => {
  const { value, className } = props;

  if (!value) {
    return <span className={cn('text-muted-foreground', className)}>-</span>;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm">🏢</span>
      <span className="font-medium">{value.name}</span>
      <span className="text-muted-foreground text-sm">({value.code})</span>
    </div>
  );
};

DepartmentShow.displayName = 'DepartmentShow';

