import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  TextField,
  Alert,
  Paper,
  MenuItem,
} from '@mui/material';
import { turmasApi, alunosApi, avaliacoesApi, notasApi } from '../api';

function parseValor(v) {
  return Number(String(v).replace(',', '.'));
}

function valorError(v) {
  if (v === '' || v === undefined) return '';
  const n = parseValor(v);
  if (Number.isNaN(n) || n < 0 || n > 10) return 'Nota deve ser um número entre 0 e 10';
  return '';
}

export default function NotasPage() {
  const [turmas, setTurmas] = useState([]);
  const [turmaId, setTurmaId] = useState('');
  const [disciplinaId, setDisciplinaId] = useState('');
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliacaoId, setAvaliacaoId] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [notasMap, setNotasMap] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    turmasApi.list().then(setTurmas);
  }, []);

  useEffect(() => {
    setAvaliacaoId('');
    setAvaliacoes([]);
    if (turmaId && disciplinaId) {
      avaliacoesApi.list({ turmaId, disciplinaId }).then(setAvaliacoes);
    }
  }, [turmaId, disciplinaId]);

  useEffect(() => {
    setAlunos([]);
    setNotasMap({});
    setFeedback(null);
    if (avaliacaoId) {
      Promise.all([alunosApi.list(turmaId), notasApi.list({ avaliacaoId })]).then(
        ([alunosList, notasList]) => {
          setAlunos(alunosList);
          const map = {};
          notasList.forEach((n) => {
            map[n.alunoId] = String(n.valor);
          });
          setNotasMap(map);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avaliacaoId]);

  const disciplinasDaTurma = turmas.find((t) => t.id === turmaId)?.disciplinas ?? [];

  const anyError = alunos.some((a) => valorError(notasMap[a.id] ?? ''));

  const handleValorChange = (alunoId, value) => {
    setNotasMap({ ...notasMap, [alunoId]: value });
  };

  const handleSave = async () => {
    setFeedback(null);
    const notas = alunos
      .filter((a) => (notasMap[a.id] ?? '') !== '')
      .map((a) => ({ alunoId: a.id, valor: parseValor(notasMap[a.id]) }));
    try {
      await notasApi.saveLote({ avaliacaoId, notas });
      setFeedback({ type: 'success', msg: 'Notas salvas com sucesso' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.response?.data?.error || 'Erro ao salvar notas' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Lançamento de Notas
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
        <TextField
          select
          label="Avaliação"
          value={avaliacaoId}
          onChange={(e) => setAvaliacaoId(e.target.value)}
          disabled={!turmaId || !disciplinaId}
          sx={{ minWidth: 200 }}
        >
          {avaliacoes.map((a) => (
            <MenuItem key={a.id} value={a.id}>
              {a.nome} (peso {a.peso})
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {turmaId && disciplinaId && avaliacoes.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Nenhuma avaliação cadastrada para esta turma/disciplina. Cadastre uma na aba
          "Avaliações" antes de lançar notas.
        </Alert>
      )}

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }}>
          {feedback.msg}
        </Alert>
      )}

      {avaliacaoId && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Matrícula</TableCell>
                <TableCell>Nota</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alunos.map((a) => {
                const valor = notasMap[a.id] ?? '';
                const erro = valorError(valor);
                return (
                  <TableRow key={a.id}>
                    <TableCell>{a.nome}</TableCell>
                    <TableCell>{a.matricula}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={valor}
                        onChange={(e) => handleValorChange(a.id, e.target.value)}
                        error={!!erro}
                        helperText={erro}
                        sx={{ width: 140 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {alunos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhum aluno cadastrado nesta turma
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {avaliacaoId && alunos.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave} disabled={anyError}>
            Salvar notas
          </Button>
        </Box>
      )}
    </Box>
  );
}
