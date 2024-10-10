import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { pageRoutes } from '@/apiRoutes';

import { makePurchase } from '@/api/purchase';
import { PHONE_PATTERN } from '@/constants';
import { useCache } from '@/core/hooks/use-cache';
import { useCart } from '@/core/hooks/use-carts';
import { useToast } from '@/core/hooks/use-toast';
import { Layout, authStatusType } from '@/pages/common/components/Layout';
import { ItemList } from '@/pages/purchase/components/ItemList';
import { Payment } from '@/pages/purchase/components/Payment';
import { ShippingInformationForm } from '@/pages/purchase/components/ShippingInformationForm';
import { Loader2 } from 'lucide-react';

export interface FormData {
  name: string;
  address: string;
  phone: string;
  requests: string;
  payment: string;
}

export interface FormErrors {
  phone: string;
}

export const Purchase: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useCache();
  const { cart, resetCart } = useCart();
  const { addToast } = useToast();

  // 구매하기 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    name: user?.displayName ?? '',
    address: '',
    phone: '',
    requests: '',
    payment: 'accountTransfer',
  });

  // 휴대폰 번호 에러 state
  const [errors, setErrors] = useState<FormErrors>({
    phone: '',
  });

  // 주소 및 휴대폰 번호 유효성 검사 state
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // 주소 및 휴대폰 번호 유효성 검사
  useEffect(() => {
    const { address, phone } = formData;
    const isPhoneValid = PHONE_PATTERN.test(phone);
    setIsFormValid(address.trim() !== '' && isPhoneValid);
  }, [formData]);

  // 주소 및 휴대폰 번호 변경
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      if (!PHONE_PATTERN.test(value) && value !== '') {
        setErrors((prev) => ({
          ...prev,
          phone: '-를 포함한 휴대폰 번호만 가능합니다',
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: '' }));
      }
    }
  };

  // 구매하기 버튼 클릭
  const handleClickPurchase = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || !user) return;

    // 로딩 시작
    setIsLoading(true);

    const purchaseData = {
      ...formData,
      totalAmount: 0,
      paymentMethod: formData.payment,
      shippingAddress: formData.address,
    };

    try {
      // 구매하기 API
      await makePurchase(purchaseData, user.uid, cart.cart);

      // 로딩 끝
      setIsLoading(false);

      // 성공 토스트
      addToast('구매 성공!', 'success');

      if (user) {
        // 장바구니 비우기(초기화)
        resetCart(user.uid);
      }

      navigate(pageRoutes.main);
    } catch (err) {
      // 로딩 끝
      setIsLoading(false);

      // 실패 토스트
      addToast('구매 실패!', 'error');

      // 에러 처리
      if (err instanceof Error) {
        // 에러 토스트
        addToast(err.message, 'error');
        console.error(
          '잠시 문제가 발생했습니다! 다시 시도해 주세요.',
          err.message
        );
      } else {
        // 알 수 없는 오류 토스트
        addToast('알 수 없는 오류가 발생했습니다.', 'error');
        console.error('잠시 문제가 발생했습니다! 다시 시도해 주세요.');
      }
    }
  };

  return (
    <Layout
      containerClassName="pt-[30px]"
      authStatus={authStatusType.NEED_LOGIN}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleClickPurchase}>
            <ShippingInformationForm
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
            <ItemList />
            <Payment
              paymentMethod={formData.payment}
              onPaymentMethodChange={handleInputChange}
            />
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  '구매하기'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};
