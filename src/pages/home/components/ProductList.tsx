import { IProduct } from '@/api/dtos/productDTO';
import { fetchProducts } from '@/api/product';
import { pageRoutes } from '@/apiRoutes';
import { Button } from '@/components/ui/button';
import { PRODUCT_PAGE_SIZE } from '@/constants';
import { useCache } from '@/core/hooks/use-cache';
import { useCart } from '@/core/hooks/use-carts';
import { useFilter } from '@/core/hooks/use-filter';
import { extractIndexLink, isFirebaseIndexError } from '@/helpers/error';
import { useModal } from '@/hooks/useModal';
import { FirebaseIndexErrorModal } from '@/pages/error/components/FirebaseIndexErrorModal';
import { CartItem } from '@/types/cartType';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCardSkeleton } from '../skeletons/ProductCardSkeleton';
import { EmptyProduct } from './EmptyProduct';
import { ProductCard } from './ProductCard';
import { ProductRegistrationModal } from './ProductRegistrationModal';

interface ProductListProps {
  pageSize?: number;
}

export const ProductList: React.FC<ProductListProps> = ({
  pageSize = PRODUCT_PAGE_SIZE,
}) => {
  const { user } = useCache();
  const { filter } = useFilter();
  const { addCartItem } = useCart();
  const navigate = useNavigate();

  const { isOpen, openModal, closeModal } = useModal();
  const [indexLink, setIndexLink] = useState<string | null>(null);
  const [isIndexErrorModalOpen, setIsIndexErrorModalOpen] =
    useState<boolean>(false);

  // Query hooks로 이전할 예정
  const {
    data,
    error,
    isError,
    refetch,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', filter],
    queryFn: ({ pageParam = 1 }) => fetchProducts(filter, pageSize, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage! + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // firebase index 에러관련, 모달
  if (isError) {
    if (isFirebaseIndexError(error.message)) {
      const link = extractIndexLink(error.message);
      setIndexLink(link);
      setIsIndexErrorModalOpen(true);
    }
  }

  // 장바구니 버튼
  const handleCartAction = (product: IProduct): void => {
    if (user) {
      const cartItem: CartItem = { ...product, count: 1 };
      console.log(`${product.title} 상품이 \n장바구니에 담겼습니다.`);
      addCartItem({ item: cartItem, userId: user.uid, count: 1 });
    } else {
      navigate(pageRoutes.login);
    }
  };

  // 구매하기 버튼
  const handlePurchaseAction = (product: IProduct): void => {
    if (user) {
      const cartItem: CartItem = { ...product, count: 1 };
      addCartItem({ item: cartItem, userId: user.uid, count: 1 });
      navigate(pageRoutes.cart);
    } else {
      navigate(pageRoutes.login);
    }
  };

  const handleProductAdded = (): void => {
    refetch();
  };

  const firstProductImage = data?.pages[0]?.products[0]?.image;

  useEffect(() => {
    if (firstProductImage) {
      const img = new Image();
      img.src = firstProductImage;
    }
  }, [firstProductImage]);

  // console.log(
  //   'data?.pageParams & data?.pages: ',
  //   data?.pages,
  //   data?.pageParams
  // );
  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end mt-4">
          {user && (
            <Button onClick={openModal}>
              <Plus className="w-4 h-4 mr-2" /> 상품 등록
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: pageSize }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : data?.pages[0]?.products.length === 0 ? (
          <EmptyProduct onAddProduct={openModal} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data?.pages.map((page) =>
                page.products.map((product, index) => (
                  <ProductCard
                    key={`${product.id}_${index}`}
                    product={product}
                    onClickAddCartButton={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleCartAction(product);
                    }}
                    onClickPurchaseButton={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handlePurchaseAction(product);
                    }}
                  />
                ))
              )}
            </div>
            {hasNextPage && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? '로딩 중...' : '더 보기'}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}

        {isOpen && (
          <ProductRegistrationModal
            isOpen={isOpen}
            onClose={closeModal}
            onProductAdded={handleProductAdded}
          />
        )}
        <FirebaseIndexErrorModal
          isOpen={isIndexErrorModalOpen}
          onClose={() => setIsIndexErrorModalOpen(false)}
          indexLink={indexLink}
        />
      </div>
    </>
  );
};
