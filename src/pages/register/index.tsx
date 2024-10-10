import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, User } from 'lucide-react';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerUserAPI } from '@/api/auth';
import { pageRoutes } from '@/apiRoutes';
import { EMAIL_PATTERN } from '@/constants';
import { useToast } from '@/core/hooks/use-toast';
import { Layout, authStatusType } from '@/pages/common/components/Layout';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

type IStateRegisterStatus = 'succeeded' | 'error' | 'loading' | null;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [registerStatus, setRegisterStatus] =
    useState<IStateRegisterStatus>(null);

  useEffect(() => {
    // 회원가입 완료되면 로그인 페이지로 리다이렉트
    if (registerStatus === 'succeeded') {
      navigate(pageRoutes.login);
    }
  }, [registerStatus, navigate]);

  const validateForm = (): boolean => {
    let formErrors: FormErrors = {};
    if (!name) formErrors.name = '이름을 입력하세요';
    if (!email) {
      formErrors.email = '이메일을 입력하세요';
    } else if (!EMAIL_PATTERN.test(email)) {
      formErrors.email = '이메일 양식이 올바르지 않습니다';
    }
    if (!password) formErrors.password = '비밀번호를 입력하세요';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // 회원가입 시작
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유효성 검사
    if (validateForm()) {
      setRegisterStatus('loading');

      try {
        await registerUserAPI({ email, password, name });
        addToast('회원가입이 완료되었습니다.', 'success');
        setRegisterStatus('succeeded');
      } catch (error) {
        setRegisterStatus('error');
        addToast('회원가입 중 오류가 발생했습니다.', 'error');
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    switch (id) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
  };

  return (
    <Layout authStatus={authStatusType.NEED_NOT_LOGIN}>
      <div className="flex flex-col justify-center w-full h-screen max-w-md mx-auto space-y-8">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <div className="relative">
              <User className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                id="name"
                type="text"
                className="pl-10"
                value={name}
                onChange={handleInputChange}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={email}
                onChange={handleInputChange}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                id="password"
                type="password"
                className="pl-10"
                value={password}
                onChange={handleInputChange}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={registerStatus === 'loading'}
          >
            {registerStatus === 'loading' ? '가입 중...' : '회원가입'}
          </Button>
          {registerStatus === 'error' && (
            <p className="text-sm text-red-500">회원가입 오류</p>
          )}
        </form>
      </div>
    </Layout>
  );
};
