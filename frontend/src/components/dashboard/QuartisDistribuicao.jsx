import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

export default function QuartisDistribuicao({ linhas }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Distribuição de Médias por Turma
      </Typography>
      {linhas.length === 0 ? (
        <Typography color="text.secondary">Nenhuma turma cadastrada</Typography>
      ) : (
        <Grid container spacing={2}>
          {linhas.map((l) => (
            <Grid key={l.turmaId} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{l.turmaNome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {l.nAlunosDecididos} aluno(s) decidido(s)
                  </Typography>
                  <Typography variant="body2">Q1: {l.Q1 === null ? '-' : l.Q1}</Typography>
                  <Typography variant="body2">Mediana: {l.mediana === null ? '-' : l.mediana}</Typography>
                  <Typography variant="body2">Q3: {l.Q3 === null ? '-' : l.Q3}</Typography>
                  {l.Q1 === null && (
                    <Typography variant="caption" color="text.secondary">
                      Turma pequena, sem dados suficientes
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
