import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Typography, Box,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { listProducts, deleteProduct } from '../api/products';
import type { Product } from '../types';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  const load = () => {
    listProducts().then(res => setProducts(res.data));
  };

  useEffect(load, []);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(id).then(load);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h5">Produtos</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/products/new')}>
          Novo Produto
        </Button>
      </Box>
      {products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Nenhum produto encontrado.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>R$ {Number(p.price).toFixed(2)}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/products/${p.id}/edit`)}
                      title="Editar"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(p.id)}
                      color="error"
                      title="Excluir"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
