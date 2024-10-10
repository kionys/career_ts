import { NewProductDTO } from '@/api/dtos/productDTO';
import { addProductAPI } from '@/api/product';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ALL_CATEGORY_ID, categories } from '@/constants';
import { useToast } from '@/core/hooks/use-toast';
import { createNewProduct } from '@/helpers/product';
import { uploadImage } from '@/utils/imageUpload';
import { useForm } from 'react-hook-form';

interface ProductRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export const ProductRegistrationModal: React.FC<
  ProductRegistrationModalProps
> = ({ isOpen, onClose, onProductAdded }) => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewProductDTO>();

  const { addToast } = useToast();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상품 등록</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (data) => {
            const imageList = data.image as unknown as FileList;
            try {
              if (!data.image) {
                throw new Error('이미지를 선택해야 합니다.');
              }
              const imageUrl = await uploadImage(imageList[0] as File);
              if (!imageUrl) {
                throw new Error('이미지 업로드에 실패했습니다.');
              }

              const newProduct = createNewProduct(data, imageUrl);

              // 상품 등록 API
              await addProductAPI(newProduct);

              onClose();
              onProductAdded();
              addToast('상품 등록이 완료되었습니다.', 'success');
            } catch (error) {
              console.error('물품 등록에 실패했습니다.', error);
            }
          })}
        >
          <div className="grid gap-4 py-4">
            <Input
              placeholder="상품명"
              {...register('title', { required: true })}
            />
            {errors.title?.type === 'required' && (
              <div className="pt-2 text-xs text-red-600">
                상품명은 필수 입력사항입니다.
              </div>
            )}
            <Input
              type="number"
              placeholder="가격"
              {...register('price', { required: true })}
            />
            {errors.price?.type === 'required' && (
              <div className="pt-2 text-xs text-red-600">
                가격은 필수 입력사항입니다.
              </div>
            )}
            <Textarea
              className="resize-none"
              placeholder="상품 설명"
              {...register('description', { required: false })}
            />
            <Select
              onValueChange={(value: string) => setValue('category.id', value)}
              // {...register('category.id', { required: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((category) => category.id !== ALL_CATEGORY_ID)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.category?.id?.type === 'required' && (
              <div className="pt-2 text-xs text-red-600">
                카테고리 필수 입력사항입니다.
              </div>
            )}
            <Input
              className="cursor-pointer"
              type="file"
              accept="image/*"
              {...register('image', { required: true })}
            />
            {errors.image?.type === 'required' && (
              <div className="pt-2 text-xs text-red-600">
                파일은 필수 입력사항입니다.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">등록</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
