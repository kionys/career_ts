import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

import { useFilter } from '@/core/hooks/use-filter';
import { ApiErrorBoundary } from '@/pages/common/components/ApiErrorBoundary';
import { debounce } from '@/utils/common';
import { CategoryRadioGroup } from './CategoryRadioGroup';
import { PriceRange } from './PriceRange';
import { SearchBar } from './SearchBar';

interface ProductFilterBoxProps {
  children: React.ReactNode;
}

const ProductFilterBox: React.FC<ProductFilterBoxProps> = ({ children }) => (
  <Card className="my-4">
    <CardContent>{children}</CardContent>
  </Card>
);

export const ProductFilter = () => {
  const { filter, setFilter } = useFilter();

  // 상품명 검색
  const handleChangeInput = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilter({
        ...filter,
        title: e.target.value,
      });
    },
    300
  );

  // 상품 카테고리 변경
  const handleChangeCategory = (value: string) => {
    setFilter({ categoryId: value });
  };
  return (
    <div className="space-y-4">
      <ProductFilterBox>
        <SearchBar onChangeInput={handleChangeInput} />
      </ProductFilterBox>
      <ProductFilterBox>
        <ApiErrorBoundary>
          <Suspense fallback={<Loader2 className="w-24 h-24 animate-spin" />}>
            <CategoryRadioGroup
              categoryId={filter.categoryId}
              onChangeCategory={handleChangeCategory}
            />
          </Suspense>
        </ApiErrorBoundary>
      </ProductFilterBox>
      <ProductFilterBox>
        <PriceRange />
      </ProductFilterBox>
    </div>
  );
};
