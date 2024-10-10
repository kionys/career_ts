export interface IProduct {
  id: string;
  title: string;
  price: number;
  description?: string;
  category: { id: string; name: string };
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedProductsDTO {
  currentPage: number; // TODO 홈에서 상품리스트를 더보기로 패칭하기 위한 페이지 리턴값 추가
  products: IProduct[];
  hasNextPage: boolean;
  totalCount: number;
}

export interface NewProductDTO {
  title: string;
  price: number;
  description?: string;
  category: { id: string; name: string };
  image: File | string | null;
}
