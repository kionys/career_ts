import {
  calculateTotal,
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
} from '@/store/cart/cartUtils';
import { CartItem } from '@/types/cartType';
import { create } from 'zustand';

// 장바구니 기본 타입
interface ICart {
  cart: CartItem[];
  totalCount: number;
  totalPrice: number;
}

// 장바구니 초기 데이터
const initialState: ICart = {
  cart: [],
  totalCount: 0,
  totalPrice: 0,
};

// [Add] 장바구니 아이템 담기
interface IPropsCartAdd {
  item: CartItem;
  userId: string;
  count: number;
}

// [Remove] 장바구니 아이템 삭제
interface IPropsCartRemove {
  itemId: string;
  userId: string;
}

// [Item Count] 장바구니 아이템의 카운트 추가
interface IPropsCartChangeCount {
  itemId: string;
  count: number;
  userId: string;
}

interface IUseCart {
  cart: ICart;
  initCart: (userId: string) => void;
  resetCart: (userId: string) => void;
  addCartItem: ({ item, userId, count }: IPropsCartAdd) => void;
  removeCartItem: ({ itemId, userId }: IPropsCartRemove) => void;
  changeCartItemCount: ({
    itemId,
    count,
    userId,
  }: IPropsCartChangeCount) => void;
}

export const useCart = create<IUseCart>((set) => ({
  cart: initialState,

  initCart: (userId: string) => {
    if (!userId) return;
    const prevCartItems = getCartFromLocalStorage(userId);
    const total = calculateTotal(prevCartItems);
    set({
      cart: {
        cart: prevCartItems,
        totalCount: total.totalCount,
        totalPrice: total.totalPrice,
      },
    });
  },

  resetCart: (userId: string) => {
    resetCartAtLocalStorage(userId);
    set({
      cart: {
        cart: [],
        totalCount: 0,
        totalPrice: 0,
      },
    });
  },

  addCartItem: ({ item, userId, count }: IPropsCartAdd) => {
    set((state) => {
      const existingItemIndex = state.cart.cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      let updatedCart = [...state.cart.cart];
      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].count += count;
      } else {
        updatedCart.push({ ...item, count });
      }
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);
      return {
        cart: {
          cart: updatedCart,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        },
      };
    });
  },

  removeCartItem: ({ itemId, userId }: IPropsCartRemove) => {
    set((state) => {
      const updatedCart = state.cart.cart.filter((item) => item.id !== itemId);
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);
      return {
        cart: {
          cart: updatedCart,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        },
      };
    });
  },

  changeCartItemCount: ({ itemId, count, userId }: IPropsCartChangeCount) => {
    set((state) => {
      const updatedCart = state.cart.cart.map((item) =>
        item.id === itemId ? { ...item, count } : item
      );
      const total = calculateTotal(updatedCart);
      setCartToLocalStorage(updatedCart, userId);
      return {
        cart: {
          cart: updatedCart,
          totalCount: total.totalCount,
          totalPrice: total.totalPrice,
        },
      };
    });
  },
}));
