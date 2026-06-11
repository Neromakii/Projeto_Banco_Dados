import api from './axios';
import type { Customer } from '../types';

export const listCustomers = () =>
  api.get<Customer[]>('/customers');

export const getCustomer = (id: number) =>
  api.get<Customer>(`/customers/${id}`);

export const createCustomer = (data: { name: string; email: string; address: string }) =>
  api.post<Customer>('/customers', data);

export const updateCustomer = (id: number, data: { name: string; email: string; address: string }) =>
  api.put<Customer>(`/customers/${id}`, data);

export const deleteCustomer = (id: number) =>
  api.delete(`/customers/${id}`);
