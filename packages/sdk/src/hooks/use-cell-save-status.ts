import { create } from 'zustand';

export type CellSaveState = 'saving' | 'saved' | 'error';

interface CellSaveStatusStore {
  cellStates: Record<string, CellSaveState>; // key: `${recordId}-${fieldId}`

  setSaving: (recordId: string, fieldId: string) => void;
  setSaved: (recordId: string, fieldId: string) => void;
  setError: (recordId: string, fieldId: string) => void;
  clearState: (recordId: string, fieldId: string) => void;
}

const getCellKey = (recordId: string, fieldId: string) => `${recordId}-${fieldId}`;

export const useCellSaveStatus = create<CellSaveStatusStore>((set) => ({
  cellStates: {},

  setSaving: (recordId, fieldId) => {
    set((state) => ({
      cellStates: {
        ...state.cellStates,
        [getCellKey(recordId, fieldId)]: 'saving',
      },
    }));
  },

  setSaved: (recordId, fieldId) => {
    const key = getCellKey(recordId, fieldId);
    set((state) => ({
      cellStates: {
        ...state.cellStates,
        [key]: 'saved',
      },
    }));

    // 自动清除"已保存"状态 (500ms后)
    setTimeout(() => {
      set((state) => {
        const newStates = { ...state.cellStates };
        delete newStates[key];
        return { cellStates: newStates };
      });
    }, 500);
  },

  setError: (recordId, fieldId) => {
    const key = getCellKey(recordId, fieldId);
    set((state) => ({
      cellStates: {
        ...state.cellStates,
        [key]: 'error',
      },
    }));

    // 错误状态不自动清除，需要用户手动重新编辑才能清除
    // 这样用户可以清楚地看到哪些单元格保存失败了
  },

  clearState: (recordId, fieldId) => {
    set((state) => {
      const newStates = { ...state.cellStates };
      delete newStates[getCellKey(recordId, fieldId)];
      return { cellStates: newStates };
    });
  },
}));
