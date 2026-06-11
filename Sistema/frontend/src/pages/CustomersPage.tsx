import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Typography, Box,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { listCustomers, deleteCustomer } from '../api/customers';
import type { Customer } from '../types';

export default function CustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);

  const load = () => {
    listCustomers().then(res => setCustomers(res.data));
  };

  useEffect(load, []);

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteCustomer(id).then(load);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h5">Clientes</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/customers/new')}>
          Novo Cliente
        </Button>
      </Box>
      {customers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Nenhum cliente encontrado.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Ativo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.address}</TableCell>
                  <TableCell>{c.active ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/customers/${c.id}/edit`)}
                      title="Editar"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(c.id)}
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
