import api from './axios';
import type { Product } from '../types';

export const listProducts = () =>
  api.get<Product[]>('/products');

export const getProduct = (id: string) =>
  api.get<Product>(`/products/${id}`);

export const createProduct = (data: Omit<Product, 'id'>) =>
  api.post<Product>('/products', data);

export const updateProduct = (id: string, data: Omit<Product, 'id'>) =>
  api.put<Product>(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`);
