import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TextField,
  Chip,
  Paper,
  MenuItem,
} from '@mui/material';
import { turmasApi, mediasApi } from '../api';

const STATUS_LABEL = {
  aprovado: 'Aprovado',
  reprovado: 'Reprovado',
  'em andamento': 'Em andamento',
  'sem notas': 'Sem notas',
};

const STATUS_COLOR = {
  aprovado: 'success',
  reprovado: 'error',
  'em andamento': 'warning',
  'sem notas': 'default',
};

export default function MediasPage() {
  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState('');
  const [disciplinaId, setDisciplinaId] = useState('');
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    turmasApi.list().then(setTurmas);
  }, []);

  useEffect(() => {
    setMedias([]);
    if (turmaId && disciplinaId) {
      mediasApi.list({ turmaId, disciplinaId }).then(setMedias);
    }
  }, [turmaId, disciplinaId]);

  const disciplinasDaTurma = turmas.find((t) => t.id === turmaId)?.disciplinas ?? [];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Médias
      </Typography>

      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Turma"
          value={turmaId}
          onChange={(e) => {
            setTurmaId(e.target.value);
            setDisciplinaId('');
          }}
          sx={{ minWidth: 200 }}
        >
          {turmas.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.nome}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Disciplina"
          value={disciplinaId}
          onChange={(e) => setDisciplinaId(e.target.value)}
          disabled={!turmaId}
          sx={{ minWidth: 200 }}
        >
          {disciplinasDaTurma.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.nome}
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {turmaId && disciplinaId && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Matrícula</TableCell>
                <TableCell>Média</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medias.map((m) => (
                <TableRow key={m.alunoId}>
                  <TableCell>{m.nome}</TableCell>
                  <TableCell>{m.matricula}</TableCell>
                  <TableCell>{m.media === null ? '-' : m.media.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={STATUS_LABEL[m.status]} color={STATUS_COLOR[m.status]} size="small" />
                  </TableCell>
                </TableRow>
              ))}
              {medias.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum aluno cadastrado nesta turma
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
