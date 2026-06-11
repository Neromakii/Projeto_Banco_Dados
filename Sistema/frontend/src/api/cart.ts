import api from './axios';
import type { Cart } from '../types';

export const createCart = () =>
  api.post<{ sessionId: string }>('/cart');

export const getCart = (sessionId: string) =>
  api.get<Cart>(`/cart/${sessionId}`);

export const addCartItem = (
  sessionId: string,
  item: { productId: string; name: string; price: number; quantity: number },
) => api.post(`/cart/${sessionId}/items`, item);

export const removeCartItem = (sessionId: string, productId: string) =>
  api.delete(`/cart/${sessionId}/items/${productId}`);

export const clearCart = (sessionId: string) =>
  api.delete(`/cart/${sessionId}`);
