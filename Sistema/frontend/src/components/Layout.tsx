import { AppBar, Toolbar, Typography, Tab, Tabs, Container, Box } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Clientes', path: '/customers' },
  { label: 'Produtos', path: '/products' },
  { label: 'Carrinho', path: '/cart' },
  { label: 'Pedidos', path: '/orders' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = tabs.findIndex(t =>
    location.pathname === t.path || location.pathname.startsWith(t.path + '/'),
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 4, fontWeight: 700 }}>
            E-Commerce
          </Typography>
          <Tabs
            value={currentTab >= 0 ? currentTab : 0}
            onChange={(_, i) => navigate(tabs[i].path)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            {tabs.map(t => (
              <Tab key={t.path} label={t.label} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
