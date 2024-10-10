import { ProductFilter } from '@/types/productType';
import { create } from 'zustand';

interface IUseFilter {
  filter: ProductFilter;
  setFilter: (props: ProductFilter) => void;
}

export const useFilter = create<IUseFilter>((set) => ({
  filter: {
    categoryId: '-1',
    title: '',
    minPrice: 0,
    maxPrice: 0,
  },
  setFilter: (filter: ProductFilter) => {
    set((state) => ({ ...state, filter }));
  },
}));
