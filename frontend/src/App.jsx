import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AlunosPage from './pages/AlunosPage';
import TurmasPage from './pages/TurmasPage';
import DisciplinasPage from './pages/DisciplinasPage';
import AvaliacoesPage from './pages/AvaliacoesPage';
import NotasPage from './pages/NotasPage';
import MediasPage from './pages/MediasPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/alunos" replace />} />
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/turmas" element={<TurmasPage />} />
        <Route path="/disciplinas" element={<DisciplinasPage />} />
        <Route path="/avaliacoes" element={<AvaliacoesPage />} />
        <Route path="/notas" element={<NotasPage />} />
        <Route path="/medias" element={<MediasPage />} />
        <Route path="/configuracoes" element={<ConfiguracoesPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
