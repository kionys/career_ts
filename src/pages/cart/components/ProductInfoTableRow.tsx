import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { MAX_CART_VALUE } from '@/constants';
import { useCart } from '@/core/hooks/use-carts';
import { cartValidationMessages } from '@/messages';
import { IUser } from '@/types/authType';
import { CartItem } from '@/types/cartType';
import { formatPrice } from '@/utils/formatter';
import { Trash2 } from 'lucide-react';

interface ProductInfoTableRowProps {
  item: CartItem;
  user: IUser | null;
}

export const ProductInfoTableRow = ({
  item,
  user,
}: ProductInfoTableRowProps) => {
  const { id, title, count, image, price } = item;
  const { removeCartItem, changeCartItemCount } = useCart();

  // 장바구니 아이템 삭제
  const handleClickDeleteItem = () => {
    if (user) {
      removeCartItem({ itemId: id, userId: user.uid });
    }
  };

  // 장바구니 아이템의 카운트 추가
  const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newCount = Number(e.target.value);

    if (newCount > MAX_CART_VALUE) {
      alert(cartValidationMessages.MAX_INPUT_VALUE);
      return;
    }

    if (user) {
      changeCartItemCount({ itemId: id, count: newCount, userId: user.uid });
    }
  };

  return (
    <TableRow>
      <TableCell className="text-center">
        <img src={image} height="80" alt={title} />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <Input
          type="number"
          onChange={handleChangeCount}
          value={count}
          className="w-20"
        />
      </TableCell>
      <TableCell>{formatPrice(price * count)}</TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={handleClickDeleteItem}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
