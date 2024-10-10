import { useToast } from '@/core/hooks/use-toast';

interface IPropsToast {
  toast: { id: number; message: string; type?: string };
}
/**
 * @author 김기원
 * 공통 토스트 컴포넌트
 */
const ToastContainer = () => {
  const { toasts } = useToast();
  return toasts.map((toast) => <ToastItem key={toast.id} toast={toast} />);
};
export default ToastContainer;

const ToastItem = ({ toast }: IPropsToast) => {
  return (
    <div className="fixed z-50 w-[80%] space-y-2 transform -translate-x-1/2 bottom-5 left-1/2">
      <div
        className={`flex items-center justify-between flex-1 gap-2 p-3 mb-2 text-white ${toast.type === 'success' ? 'bg-blue-500' : 'bg-red-300'} rounded-lg opacity-0 animate-fade-in`}
      >
        <div>{toast.message}</div>
        <button onClick={() => useToast.getState().removeToast(toast.id)}>
          닫기
        </button>
      </div>
    </div>
  );
};
