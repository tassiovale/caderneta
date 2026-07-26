import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

const TIPO_LABEL = {
  excepcional: 'Excepcional',
  critico: 'Crítico',
};

const TIPO_COLOR = {
  excepcional: 'success',
  critico: 'error',
};

export default function TabelaOutliers({ outliers, filtro, onFiltroChange }) {
  const linhas = outliers.filter((o) => filtro === 'todos' || o.tipo === filtro);

  return (
    <Paper sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        Alunos Outliers
      </Typography>
      <ToggleButtonGroup
        value={filtro}
        exclusive
        onChange={(e, value) => value && onFiltroChange(value)}
        size="small"
        sx={{ px: 2, pb: 2 }}
      >
        <ToggleButton value="todos">Todos</ToggleButton>
        <ToggleButton value="excepcional">Excepcional</ToggleButton>
        <ToggleButton value="critico">Crítico</ToggleButton>
      </ToggleButtonGroup>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Aluno</TableCell>
            <TableCell>Matrícula</TableCell>
            <TableCell>Turma</TableCell>
            <TableCell>Média</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Distância IQR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {linhas.map((o) => (
            <TableRow key={o.alunoId}>
              <TableCell>{o.nome}</TableCell>
              <TableCell>{o.matricula}</TableCell>
              <TableCell>{o.turmaNome}</TableCell>
              <TableCell>{o.media}</TableCell>
              <TableCell>
                <Chip label={TIPO_LABEL[o.tipo]} color={TIPO_COLOR[o.tipo]} size="small" />
              </TableCell>
              <TableCell>{o.distanciaIqr}</TableCell>
            </TableRow>
          ))}
          {linhas.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Nenhum outlier encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
