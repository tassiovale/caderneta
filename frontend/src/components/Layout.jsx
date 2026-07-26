import { AppBar, Toolbar, Typography, Tabs, Tab, Container, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { label: 'Alunos', path: '/alunos' },
  { label: 'Turmas', path: '/turmas' },
  { label: 'Disciplinas', path: '/disciplinas' },
  { label: 'Avaliações', path: '/avaliacoes' },
  { label: 'Lançamento de Notas', path: '/notas' },
  { label: 'Médias', path: '/medias' },
  { label: 'Configurações', path: '/configuracoes' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = TABS.findIndex((t) => location.pathname.startsWith(t.path));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ mr: 4 }}>
            Caderneta
          </Typography>
          <Tabs
            value={currentTab === -1 ? 0 : currentTab}
            textColor="inherit"
            indicatorColor="secondary"
            onChange={(e, value) => navigate(TABS[value].path)}
          >
            {TABS.map((tab) => (
              <Tab key={tab.path} label={tab.label} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>{children}</Container>
    </Box>
  );
}
