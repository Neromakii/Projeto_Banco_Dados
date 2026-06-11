import api from './axios';
import type { Order, OrderWithItems } from '../types';

export const createOrder = (data: { sessionId: string; customerId: number }) =>
  api.post<Order>('/orders', data);

export const listOrders = () =>
  api.get<Order[]>('/orders');

export const getOrder = (id: number) =>
  api.get<OrderWithItems>(`/orders/${id}`);

export const getCustomerOrders = (customerId: number) =>
  api.get<Order[]>(`/customers/${customerId}/orders`);
