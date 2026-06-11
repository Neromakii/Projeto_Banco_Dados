export interface Customer {
  id: number;
  name: string;
  email: string;
  address: string;
  active: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  attributes: Record<string, string>;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
}

export interface Order {
  id: number;
  customerId: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  orderId?: number;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  customerName?: string;
}
