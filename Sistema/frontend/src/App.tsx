import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CustomersPage from './pages/CustomersPage';
import CustomerFormPage from './pages/CustomerFormPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
