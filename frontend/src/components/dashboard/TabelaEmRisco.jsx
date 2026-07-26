import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

export default function TabelaEmRisco({ linhas }) {
  return (
    <Paper sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
        Alunos em Risco
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Aluno</TableCell>
            <TableCell>Matrícula</TableCell>
            <TableCell>Turma</TableCell>
            <TableCell>Disciplina</TableCell>
            <TableCell>Média Atual</TableCell>
            <TableCell>Média Projetada</TableCell>
            <TableCell>Diferença da Mínima</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {linhas.map((l) => (
            <TableRow key={`${l.alunoId}-${l.disciplinaId}`}>
              <TableCell>{l.nome}</TableCell>
              <TableCell>{l.matricula}</TableCell>
              <TableCell>{l.turmaNome}</TableCell>
              <TableCell>{l.disciplinaNome}</TableCell>
              <TableCell>{l.mediaAtual}</TableCell>
              <TableCell>{l.mediaProjetada}</TableCell>
              <TableCell>{l.diferencaDaMinima}</TableCell>
            </TableRow>
          ))}
          {linhas.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                Nenhum aluno em risco
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
