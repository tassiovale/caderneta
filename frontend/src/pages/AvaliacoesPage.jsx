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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Paper,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { avaliacoesApi, turmasApi } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyForm = { nome: '', peso: '', turmaId: '', disciplinaId: '' };

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [somaExistente, setSomaExistente] = useState(0);

  const load = () => avaliacoesApi.list().then(setAvaliacoes);

  useEffect(() => {
    load();
    turmasApi.list().then(setTurmas);
  }, []);

  useEffect(() => {
    if (formOpen && form.turmaId && form.disciplinaId) {
      avaliacoesApi
        .list({ turmaId: form.turmaId, disciplinaId: form.disciplinaId })
        .then((list) => {
          const soma = list
            .filter((a) => a.id !== editingId)
            .reduce((s, a) => s + a.peso, 0);
          setSomaExistente(soma);
        });
    } else {
      setSomaExistente(0);
    }
  }, [formOpen, form.turmaId, form.disciplinaId, editingId]);

  const disponivel = 100 - somaExistente;
  const pesoNum = Number(String(form.peso).replace(',', '.'));
  let pesoError = '';
  if (form.peso !== '') {
    if (Number.isNaN(pesoNum) || pesoNum <= 0) {
      pesoError = 'Peso deve ser um número maior que zero';
    } else if (form.turmaId && form.disciplinaId && pesoNum > disponivel) {
      pesoError = `Peso excede o disponível (${disponivel})`;
    }
  }

  const disciplinasDaTurma = turmas.find((t) => t.id === form.turmaId)?.disciplinas ?? [];

  const isInvalid =
    !form.nome ||
    form.peso === '' ||
    !form.turmaId ||
    !form.disciplinaId ||
    !!pesoError;

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setFormOpen(true);
  };

  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({
      nome: a.nome,
      peso: String(a.peso),
      turmaId: a.turmaId,
      disciplinaId: a.disciplinaId,
    });
    setError('');
    setFormOpen(true);
  };

  const handleSave = async () => {
    setError('');
    const payload = {
      nome: form.nome,
      peso: pesoNum,
      turmaId: form.turmaId,
      disciplinaId: form.disciplinaId,
    };
    try {
      if (editingId) {
        await avaliacoesApi.update(editingId, payload);
      } else {
        await avaliacoesApi.create(payload);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar');
    }
  };

  const handleDelete = async () => {
    await avaliacoesApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Avaliações</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nova avaliação
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Turma</TableCell>
              <TableCell>Disciplina</TableCell>
              <TableCell>Peso</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {avaliacoes.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.nome}</TableCell>
                <TableCell>{a.turma?.nome}</TableCell>
                <TableCell>{a.disciplina?.nome}</TableCell>
                <TableCell>{a.peso}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(a)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteTarget(a)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {avaliacoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhuma avaliação cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar avaliação' : 'Nova avaliação'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            autoFocus
          />
          <TextField
            select
            label="Turma"
            value={form.turmaId}
            onChange={(e) => setForm({ ...form, turmaId: e.target.value, disciplinaId: '' })}
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
            value={form.disciplinaId}
            onChange={(e) => setForm({ ...form, disciplinaId: e.target.value })}
            disabled={!form.turmaId}
          >
            {disciplinasDaTurma.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.nome}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Peso"
            value={form.peso}
            onChange={(e) => setForm({ ...form, peso: e.target.value })}
            error={!!pesoError}
            helperText={
              pesoError ||
              (form.turmaId && form.disciplinaId ? `Peso disponível: ${disponivel}` : '')
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={isInvalid}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Excluir avaliação "${deleteTarget?.nome}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
