import { Suspense, useEffect } from 'react';

import { useCache } from '@/core/hooks/use-cache';
import { auth } from '@/firebase';
import { ApiErrorBoundary } from '@/pages/common/components/ApiErrorBoundary';
import { Layout } from '@/pages/common/components/Layout';
import { IUser } from '@/types/authType';
import { onAuthStateChanged } from 'firebase/auth';
import { ProductFilter } from './components/ProductFilter';
import { ProductList } from './components/ProductList';

export const Home = () => {
  const { user, setUser } = useCache();

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
    <>
      <Layout>
        <ProductFilter />
        <ApiErrorBoundary>
          <Suspense fallback={<LoadingSkeleton />}>
            <ProductList />
          </Suspense>
        </ApiErrorBoundary>
      </Layout>
    </>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {[...Array(12)].map((_, index) => (
      <div key={index} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
    ))}
  </div>
);
