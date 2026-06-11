import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { createCustomer, getCustomer, updateCustomer } from '../api/customers';

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (id) {
      getCustomer(Number(id)).then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setAddress(res.data.address);
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, email, address };
    const request = isEdit
      ? updateCustomer(Number(id), data)
      : createCustomer(data);
    request.then(() => navigate('/customers'));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Endereço"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
            fullWidth
            multiline
            rows={2}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/customers')}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
