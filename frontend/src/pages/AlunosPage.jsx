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
import { alunosApi, turmasApi } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyForm = { nome: '', matricula: '', dataNascimento: '', turmaId: '' };

export default function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => alunosApi.list().then(setAlunos);

  useEffect(() => {
    load();
    turmasApi.list().then(setTurmas);
  }, []);

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
      matricula: a.matricula,
      dataNascimento: a.dataNascimento ?? '',
      turmaId: a.turmaId ?? '',
    });
    setError('');
    setFormOpen(true);
  };

  const handleSave = async () => {
    setError('');
    const payload = {
      nome: form.nome,
      matricula: form.matricula,
      dataNascimento: form.dataNascimento || null,
      turmaId: form.turmaId || null,
    };
    try {
      if (editingId) {
        await alunosApi.update(editingId, payload);
      } else {
        await alunosApi.create(payload);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar');
    }
  };

  const handleDelete = async () => {
    await alunosApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Alunos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Novo aluno
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Matrícula</TableCell>
              <TableCell>Data de nascimento</TableCell>
              <TableCell>Turma</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alunos.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.nome}</TableCell>
                <TableCell>{a.matricula}</TableCell>
                <TableCell>{a.dataNascimento ?? '-'}</TableCell>
                <TableCell>{a.turma?.nome ?? '-'}</TableCell>
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
            {alunos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum aluno cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar aluno' : 'Novo aluno'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            autoFocus
          />
          <TextField
            label="Matrícula"
            value={form.matricula}
            onChange={(e) => setForm({ ...form, matricula: e.target.value })}
          />
          <TextField
            label="Data de nascimento"
            type="date"
            value={form.dataNascimento}
            onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            select
            label="Turma"
            value={form.turmaId}
            onChange={(e) => setForm({ ...form, turmaId: e.target.value })}
          >
            <MenuItem value="">Sem turma</MenuItem>
            {turmas.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.nome}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.nome || !form.matricula}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Excluir aluno "${deleteTarget?.nome}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
