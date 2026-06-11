import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Button,
} from '@mui/material';
import { getOrder } from '../api/orders';
import type { OrderWithItems } from '../types';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithItems | null>(null);

  useEffect(() => {
    if (id) {
      getOrder(Number(id)).then(res => setOrder(res.data));
    }
  }, [id]);

  if (!order) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h5">Pedido #{order.id}</Typography>
        <Button variant="outlined" onClick={() => navigate('/orders')}>
          Voltar
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>
          <strong>Cliente:</strong> {order.customerName || order.customerId}
        </Typography>
        <Typography>
          <strong>Total:</strong> R$ {Number(order.total).toFixed(2)}
        </Typography>
        <Typography>
          <strong>Status:</strong> {order.status}
        </Typography>
        <Typography>
          <strong>Data:</strong> {new Date(order.createdAt).toLocaleString('pt-BR')}
        </Typography>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Itens do Pedido
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items && order.items.length > 0 ? (
              order.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>R$ {Number(item.productPrice).toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>R$ {(Number(item.productPrice) * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
