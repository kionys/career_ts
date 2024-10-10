import { IUser } from '@/types/authType';
import localforage from 'localforage';
import { create } from 'zustand';

interface IUseCache {
  user?: IUser | null;
  setUser: (props: IUser | null) => void;
}

export const useCache = create<IUseCache>((set) => ({
  user: null,
  setUser: async (user: IUser | null) => {
    set((state) => ({ ...state, user: user }));
    await localforage.setItem('user', user);
  },
}));
