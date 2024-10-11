import { createBrowserRouter, Outlet } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import { Cart } from '@/pages/cart';
import { RootErrorBoundary } from '@/pages/common/components/RootErrorHandler';
import { RootSuspense } from '@/pages/common/components/RootSuspense';
import { ErrorPage } from '@/pages/error/components/ErrorPage';
import { NotFoundPage } from '@/pages/error/components/NotFoundPage';
import { Home } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { Purchase } from '@/pages/purchase';
import { RegisterPage } from '@/pages/register';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useCache } from './core/hooks/use-cache';
import { auth } from './firebase';
import { IUser } from './types/authType';

const CommonLayout = () => {
  const { setUser } = useCache();

  useEffect(() => {
    const initCache = async () => {
      // 인증 상태 감지
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const auth: IUser = {
            uid: user.uid!,
            email: user.email!,
            displayName: user.displayName!,
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
    <RootErrorBoundary>
      <RootSuspense>
        <Outlet />
      </RootSuspense>
    </RootErrorBoundary>
  );
};

const router = createBrowserRouter([
  {
    element: <CommonLayout />,
    children: [
      { path: pageRoutes.main, element: <Home />, errorElement: <ErrorPage /> },
      {
        path: pageRoutes.register,
        element: <RegisterPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: pageRoutes.login,
        element: <LoginPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: pageRoutes.cart,
        element: <Cart />,
        errorElement: <ErrorPage />,
      },
      {
        path: pageRoutes.purchase,
        element: <Purchase />,
        errorElement: <ErrorPage />,
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
