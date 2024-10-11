import { useCart } from '@/core/hooks/use-carts';
import { CartTable } from '@/pages/cart/components/CartTable';
import { EmptyNotice } from '@/pages/cart/components/EmptyNotice';
import { Layout, authStatusType } from '@/pages/common/components/Layout';

export const Cart = () => {
  const { cart } = useCart();

  const isExist = cart.cart.length > 0;

  return (
    <Layout
      containerClassName="p-2.5 flex flex-col"
      authStatus={authStatusType.NEED_LOGIN}
    >
      {isExist ? <CartTable /> : <EmptyNotice />}
    </Layout>
  );
};
