import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFilter } from '@/core/hooks/use-filter';
import { debounce } from '@/utils/common';
import React, { useCallback } from 'react';

export const PriceRange = () => {
  const { filter, setFilter } = useFilter();

  // 상품 가격 범위 (최소금액 ~ 최대금액) 변경
  const onChangePrice = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const numericValue = value === '' ? 0 : parseInt(value, 10); // 빈 문자열이면 0으로 처리
      if (!isNaN(numericValue)) {
        setFilter({ ...filter, [name]: numericValue });
      }
    }, 300),
    [filter, setFilter]
  );

  // 최소금액
  const minPrice = filter.minPrice ?? 0;

  // 최대금액
  const maxPrice = filter.maxPrice ?? 0;

  return (
    <div className="mt-4 space-y-2">
      <Label>가격 범위</Label>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Input
            type="number"
            min={minPrice}
            step="1000"
            name="minPrice"
            placeholder="최소 금액"
            onChange={onChangePrice}
            className="pr-8 w-[120px]"
          />
          <span className="absolute text-sm -translate-y-1/2 right-3 top-1/2">
            원
          </span>
        </div>
        <span className="text-sm">~</span>
        <div className="relative">
          <Input
            type="number"
            min={maxPrice}
            step="1000"
            name="maxPrice"
            placeholder="최대 금액"
            onChange={onChangePrice}
            className="pr-8 w-[120px]"
          />
          <span className="absolute text-sm -translate-y-1/2 right-3 top-1/2">
            원
          </span>
        </div>
      </div>
    </div>
  );
};
