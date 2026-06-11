import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Snackbar,
} from '@mui/material';
import { createCart, getCart, addCartItem, removeCartItem, clearCart } from '../api/cart';
import { listProducts } from '../api/products';
import { listCustomers } from '../api/customers';
import { createOrder } from '../api/orders';
import type { CartItem, Product, Customer } from '../types';

const SESSION_KEY = 'cart_session_id';

export default function CartPage() {
  const [sessionId, setSessionId] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY),
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [snack, setSnack] = useState('');

  const loadCart = useCallback(() => {
    if (sessionId) {
      getCart(sessionId)
        .then(res => setCart(res.data.items || []))
        .catch(() => {
          localStorage.removeItem(SESSION_KEY);
          setSessionId(null);
          setSnack('Sessão expirada. Crie um novo carrinho.');
        });
    }
  }, [sessionId]);

  useEffect(() => {
    loadCart();
    listProducts().then(res => setProducts(res.data));
    listCustomers().then(res => setCustomers(res.data));
  }, [loadCart]);

  const handleCreateCart = () => {
    createCart()
      .then(res => {
        const sid = res.data.sessionId;
        localStorage.setItem(SESSION_KEY, sid);
        setSessionId(sid);
      })
      .catch((err) => setSnack(`Erro: ${err?.response?.data?.message || err?.message}`));
  };

  const handleAddItem = () => {
    if (!selectedProductId || !sessionId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    addCartItem(sessionId, {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    })
      .then(() => {
        loadCart();
        setSelectedProductId('');
        setQuantity(1);
        setSnack('Item adicionado ao carrinho');
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || 'Erro ao adicionar item';
        setSnack(`Erro: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
      });
  };

  const handleRemoveItem = (productId: string) => {
    if (!sessionId) return;
    removeCartItem(sessionId, productId)
      .then(loadCart)
      .catch((err) => setSnack(`Erro: ${err?.response?.data?.message || err?.message}`));
  };

  const handleClearCart = () => {
    if (!sessionId) return;
    clearCart(sessionId)
      .then(() => {
        loadCart();
        setSnack('Carrinho limpo');
      })
      .catch((err) => setSnack(`Erro: ${err?.response?.data?.message || err?.message}`));
  };

  const handleCheckout = () => {
    if (!sessionId || !selectedCustomerId) return;
    createOrder({ sessionId, customerId: Number(selectedCustomerId) })
      .then(() => {
        localStorage.removeItem(SESSION_KEY);
        setSessionId(null);
        setCart([]);
        setSelectedCustomerId('');
        setSnack('Pedido criado com sucesso!');
      })
      .catch((err) => setSnack(`Erro: ${err?.response?.data?.message || err?.message}`));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Carrinho
      </Typography>

      {!sessionId ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Nenhum carrinho ativo. Crie um para começar.
          </Typography>
          <Button variant="contained" onClick={handleCreateCart}>
            Criar Carrinho
          </Button>
        </Paper>
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Adicionar Item
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Produto</InputLabel>
                <Select
                  value={selectedProductId}
                  label="Produto"
                  onChange={e => setSelectedProductId(e.target.value)}
                >
                  {products.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} — R$ {Number(p.price).toFixed(2)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Quantidade"
                type="number"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1 } }}
                sx={{ width: 120 }}
              />
              <Button
                variant="contained"
                onClick={handleAddItem}
                disabled={!selectedProductId}
              >
                Adicionar
              </Button>
            </Box>
          </Paper>

          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell>Preço Unit.</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Carrinho vazio
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map(item => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>R$ {Number(item.price).toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        R$ {(Number(item.price) * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          Remover
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">
              Total: R$ {Number(total).toFixed(2)}
            </Typography>
            <Button variant="outlined" color="error" onClick={handleClearCart}>
              Limpar Carrinho
            </Button>
          </Box>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Finalizar Pedido
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={selectedCustomerId}
                  label="Cliente"
                  onChange={e => setSelectedCustomerId(e.target.value)}
                >
                  {customers.map(c => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name} — {c.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={!selectedCustomerId || cart.length === 0}
              >
                Finalizar Pedido
              </Button>
            </Box>
          </Paper>
        </>
      )}

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack('')}
        message={snack}
      />
    </Box>
  );
}
