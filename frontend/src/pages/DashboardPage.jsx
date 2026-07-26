import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { dashboardApi } from '../api';
import ResumoCards from '../components/dashboard/ResumoCards';
import TabelaIndiceReprovacao from '../components/dashboard/TabelaIndiceReprovacao';
import QuartisDistribuicao from '../components/dashboard/QuartisDistribuicao';
import TabelaEmRisco from '../components/dashboard/TabelaEmRisco';
import TabelaOutliers from '../components/dashboard/TabelaOutliers';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroOutlier, setFiltroOutlier] = useState('todos');

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch(() => setErro('Não foi possível carregar os dados do dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Dashboard
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && erro && <Typography color="error">{erro}</Typography>}

      {!loading && !erro && data && (
        <>
          <ResumoCards resumo={data.resumo} />
          <TabelaIndiceReprovacao linhas={data.indiceReprovacao} />
          <QuartisDistribuicao linhas={data.distribuicao} />
          <TabelaEmRisco linhas={data.emRisco} />
          <TabelaOutliers
            outliers={data.outliers}
            filtro={filtroOutlier}
            onFiltroChange={setFiltroOutlier}
          />
        </>
      )}
    </Box>
  );
}
