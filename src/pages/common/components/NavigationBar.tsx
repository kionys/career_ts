import Cookies from 'js-cookie';
import { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { ApiErrorBoundary } from '@/pages/common/components/ApiErrorBoundary';

import { Skeleton } from '@/components/ui/skeleton';
import { useCache } from '@/core/hooks/use-cache';
import { useCart } from '@/core/hooks/use-carts';
import { app } from '@/firebase';
import { useModal } from '@/hooks/useModal';
import { getAuth, signOut } from 'firebase/auth';
import { CartButton } from './CartButton';
import { ConfirmModal } from './ConfirmModal';
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';

export const NavigationBar = () => {
  const navigate = useNavigate();
  const [mount, setMount] = useState<boolean>(false);
  const { isOpen, openModal, closeModal } = useModal();
  const { user, setUser } = useCache();
  const { cart, initCart } = useCart();

  useEffect(() => {
    setMount(true);
  }, []);

  // console.log(cart);

  // 회원의 장바구니 가져오기
  useEffect(() => {
    if (user && cart.cart.length === 0) {
      initCart(user.uid);
    }
  }, [user, cart.cart.length]);

  // 로그아웃 모달 열기
  const handleLogout = () => {
    openModal();
  };

  // 로그아웃
  const handleConfirmLogout = async () => {
    const auth = getAuth(app);

    await signOut(auth).then(() => {
      console.log('로그아웃 성공');
    });
    setUser(null);
    Cookies.remove('accessToken');
    closeModal();
    navigate('/login');
  };

  // Go Home
  const handleClickLogo = () => {
    navigate(pageRoutes.main);
  };
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white shadow-md">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={handleClickLogo}
            >
              스파르타 마트
            </h1>

            <div className="flex items-center space-x-4">
              {!user ? (
                <Suspense fallback={<Skeleton className="w-24 h-8" />}>
                  <LoginButton />
                </Suspense>
              ) : (
                <ApiErrorBoundary>
                  <Suspense fallback={<Skeleton className="w-24 h-8" />}>
                    <CartButton cart={cart.cart} />
                    <LogoutButton onClick={handleLogout} />
                  </Suspense>
                </ApiErrorBoundary>
              )}
            </div>
          </div>
        </div>
      </nav>
      <ConfirmModal
        title="로그아웃 확인"
        description="로그아웃 하시겠습니까?"
        handleClickDisagree={closeModal}
        handleClickAgree={handleConfirmLogout}
        isModalOpened={isOpen}
      />
    </>
  );
};
