import { create } from 'zustand';

interface IToast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info'; // Toast 유형
}

interface IUseToast {
  toasts: IToast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
}

export const useToast = create<IUseToast>((set) => ({
  toasts: [],
  addToast: (message, type) => {
    const id = Date.now(); // 고유한 ID 생성
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 3000); // 3초 후에 Toast 제거
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
