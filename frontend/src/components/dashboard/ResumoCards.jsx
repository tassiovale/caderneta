import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

export default function ResumoCards({ resumo }) {
  const cards = [
    { label: 'Total de Alunos', value: resumo.totalAlunos },
    { label: 'Total de Turmas', value: resumo.totalTurmas },
    { label: 'Total de Disciplinas', value: resumo.totalDisciplinas },
    { label: 'Taxa de Conclusão de Notas', value: `${resumo.taxaConclusaoNotas}%` },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid key={c.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {c.label}
                </Typography>
                <Typography variant="h4">{c.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Média mínima para aprovação: {resumo.mediaMinima.toFixed(1)}
      </Typography>
    </Box>
  );
}
