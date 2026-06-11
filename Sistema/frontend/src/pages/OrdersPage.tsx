import { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Collapse, IconButton,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { listOrders, getOrder } from '../api/orders';
import type { Order, OrderItem } from '../types';

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);

  const toggle = () => {
    if (!open && items.length === 0) {
      getOrder(order.id).then(res => setItems(res.data.items || []));
    }
    setOpen(!open);
  };

  return (
    <>
      <TableRow onClick={toggle} sx={{ cursor: 'pointer' }}>
        <TableCell>
          <IconButton size="small">
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{order.id}</TableCell>
        <TableCell>{order.customerId}</TableCell>
        <TableCell>R$ {Number(order.total).toFixed(2)}</TableCell>
        <TableCell>{order.status}</TableCell>
        <TableCell>
          {new Date(order.createdAt).toLocaleString('pt-BR')}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0 }}>
          <Collapse in={open}>
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Itens do Pedido
              </Typography>
              {items.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum item encontrado.
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell>Preço</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>R$ {Number(item.productPrice).toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>R$ {(Number(item.productPrice) * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    listOrders().then(res => setOrders(res.data));
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pedidos
      </Typography>
      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Nenhum pedido encontrado.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(o => (
                <OrderRow key={o.id} order={o} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
