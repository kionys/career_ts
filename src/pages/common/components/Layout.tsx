import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { pageRoutes } from '@/apiRoutes';
import ToastContainer from '@/components/ui/toast';
import { useCache } from '@/core/hooks/use-cache';
import { NavigationBar } from './NavigationBar';

export const authStatusType = {
  NEED_LOGIN: 'NEED_LOGIN',
  NEED_NOT_LOGIN: 'NEED_NOT_LOGIN',
  COMMON: 'COMMON',
};

interface LayoutProps {
  children: ReactNode;
  containerClassName?: string;
  authStatus?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  containerClassName = '',
  authStatus = authStatusType.COMMON,
}) => {
  const { user } = useCache();
  // const { isLogin } = useAppSelector((state) => state.auth);

  if (authStatus === authStatusType.NEED_LOGIN && !user) {
    return <Navigate to={pageRoutes.login} />;
  }

  if (authStatus === authStatusType.NEED_NOT_LOGIN && user) {
    return <Navigate to={pageRoutes.main} />;
  }

  return (
    <div>
      <ToastContainer />
      <NavigationBar />
      <div className="flex flex-col min-h-screen mt-24">
        <main className="flex-grow">
          <div className={`container mx-auto px-4 ${containerClassName}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
