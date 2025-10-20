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
    
    // 自动清除"错误"状态 (1秒后)
    setTimeout(() => {
      set((state) => {
        const newStates = { ...state.cellStates };
        delete newStates[key];
        return { cellStates: newStates };
      });
    }, 1000);
  },
  
  clearState: (recordId, fieldId) => {
    set((state) => {
      const newStates = { ...state.cellStates };
      delete newStates[getCellKey(recordId, fieldId)];
      return { cellStates: newStates };
    });
  },
}));




