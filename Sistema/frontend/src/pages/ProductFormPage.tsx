import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { createProduct, getProduct, updateProduct } from '../api/products';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [attributes, setAttributes] = useState('');

  useEffect(() => {
    if (id) {
      getProduct(id).then(res => {
        setName(res.data.name);
        setDescription(res.data.description);
        setPrice(String(res.data.price));
        setCategory(res.data.category);
        setAttributes(JSON.stringify(res.data.attributes, null, 2));
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      description,
      price: Number(price),
      category,
      attributes: attributes ? JSON.parse(attributes) : {},
    };
    const request = isEdit
      ? updateProduct(id!, data)
      : createProduct(data);
    request.then(() => navigate('/products'));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {isEdit ? 'Editar Produto' : 'Novo Produto'}
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
            label="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Preço"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
            fullWidth
            slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
          />
          <TextField
            label="Categoria"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Atributos (JSON)"
            value={attributes}
            onChange={e => setAttributes(e.target.value)}
            fullWidth
            multiline
            rows={4}
            helperText='Ex: {"cor": "azul", "tamanho": "M"}'
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/products')}>
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
