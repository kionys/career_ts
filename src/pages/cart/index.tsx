import { useCache } from '@/core/hooks/use-cache';
import { useCart } from '@/core/hooks/use-carts';
import { auth } from '@/firebase';
import { CartTable } from '@/pages/cart/components/CartTable';
import { EmptyNotice } from '@/pages/cart/components/EmptyNotice';
import { Layout, authStatusType } from '@/pages/common/components/Layout';
import { IUser } from '@/types/authType';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export const Cart = () => {
  const { cart } = useCart();
  const { user, setUser } = useCache();

  const isExist = cart.cart.length > 0;

  useEffect(() => {
    const initCache = async () => {
      // 인증 상태 감지
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const auth: IUser = {
            uid: user?.uid!,
            email: user?.email!,
            displayName: user?.displayName!,
          };
          setUser(auth);
        } else {
          setUser(null);
        }
      });
    };
    initCache();
  }, [auth]);

  return (
    <Layout
      containerClassName="p-2.5 flex flex-col"
      authStatus={authStatusType.NEED_LOGIN}
    >
      {isExist ? <CartTable /> : <EmptyNotice />}
    </Layout>
  );
};
