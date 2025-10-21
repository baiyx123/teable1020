import type { ILinkCellValue, ILinkFieldOptions } from '@teable/core';
import { FieldType } from '@teable/core';
import { cn } from '@teable/ui-lib';
import { useCellSaveStatus } from '../../hooks/use-cell-save-status';
import { CellEditor } from '../cell-value-editor';
import type { ICellValueEditor } from '../cell-value-editor/type';
import { LinkDisplayType, LinkEditor } from '../editor';

export const CellEditorWrap = (props: ICellValueEditor) => {
  const { field, wrapClassName, className, cellValue, onChange, readonly, recordId } = props;

  // 获取单元格保存状态
  const cellStates = useCellSaveStatus((state) => state.cellStates);
  const cellKey = recordId && field.id ? `${recordId}-${field.id}` : null;
  const saveState = cellKey ? cellStates[cellKey] : null;

  // 根据保存状态确定边框颜色
  const borderStyle: React.CSSProperties = saveState
    ? {
        border: `2px solid ${
          saveState === 'saving'
            ? 'rgb(96, 165, 250)' // 蓝色
            : saveState === 'saved'
              ? 'rgb(74, 222, 128)' // 绿色
              : 'rgb(248, 113, 113)' // 红色
        }`,
        borderRadius: '4px',
        boxSizing: 'border-box',
      }
    : {};
  const hasBorder = !!saveState;

  if (field.type === FieldType.Link) {
    return (
      <div
        className={cn(wrapClassName, 'max-h-96 overflow-auto', hasBorder && 'p-0.5')}
        style={borderStyle}
      >
        <LinkEditor
          className={className}
          cellValue={cellValue as ILinkCellValue | ILinkCellValue[]}
          options={field.options as ILinkFieldOptions}
          onChange={onChange}
          readonly={readonly}
          fieldId={field.id}
          recordId={recordId}
          displayType={readonly ? LinkDisplayType.List : LinkDisplayType.Grid}
        />
      </div>
    );
  }

  return (
    <div className={cn(wrapClassName, hasBorder && 'p-0.5')} style={borderStyle}>
      <CellEditor {...props} />
    </div>
  );
};
