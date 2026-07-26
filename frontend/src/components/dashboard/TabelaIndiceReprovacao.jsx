import { Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

function corIndice(percent) {
  if (percent < 10) return 'success';
  if (percent <= 30) return 'warning';
  return 'error';
}

export default function TabelaIndiceReprovacao({ linhas }) {
  return (
    <Paper sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
        Índice de Reprovação por Turma
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Turma</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Sem Notas</TableCell>
            <TableCell>Em Andamento</TableCell>
            <TableCell>Decididos</TableCell>
            <TableCell>Aprovados</TableCell>
            <TableCell>Reprovados</TableCell>
            <TableCell>Índice de Reprovação</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {linhas.map((l) => (
            <TableRow key={l.turmaId}>
              <TableCell>{l.turmaNome}</TableCell>
              <TableCell>{l.totalAlunos}</TableCell>
              <TableCell>{l.semNotas}</TableCell>
              <TableCell>{l.emAndamento}</TableCell>
              <TableCell>{l.decididos}</TableCell>
              <TableCell>{l.aprovados}</TableCell>
              <TableCell>{l.reprovados}</TableCell>
              <TableCell>
                {l.indiceReprovacaoPercent === null ? (
                  '-'
                ) : (
                  <Chip
                    label={`${l.indiceReprovacaoPercent}%`}
                    color={corIndice(l.indiceReprovacaoPercent)}
                    size="small"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
          {linhas.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                Nenhuma turma cadastrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
