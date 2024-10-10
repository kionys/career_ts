import { pageRoutes } from '@/apiRoutes';
import { Button } from '@/components/ui/button';
import { useCart } from '@/core/hooks/use-carts';
import { formatNumber, formatPrice } from '@/utils/formatter';
import { useNavigate } from 'react-router-dom';

export const PriceSummary = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  // 구매하기 페이지로 이동
  const handleClickPurchase = () => {
    navigate(pageRoutes.purchase);
  };

  return (
    <div className="flex flex-col items-end pt-4">
      <p>
        총 {formatNumber(cart.totalCount)}개, {formatPrice(cart.totalPrice)}
      </p>
      <Button onClick={handleClickPurchase} className="mt-2">
        구매하기
      </Button>
    </div>
  );
};
