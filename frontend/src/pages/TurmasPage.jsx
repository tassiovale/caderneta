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
  Chip,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { turmasApi, disciplinasApi } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyForm = { nome: '', anoSerie: '', disciplinaIds: [] };

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => turmasApi.list().then(setTurmas);

  useEffect(() => {
    load();
    disciplinasApi.list().then(setDisciplinas);
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setFormOpen(true);
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setForm({
      nome: t.nome,
      anoSerie: t.anoSerie,
      disciplinaIds: t.disciplinas.map((d) => d.id),
    });
    setError('');
    setFormOpen(true);
  };

  const handleSave = async () => {
    setError('');
    const payload = {
      nome: form.nome,
      anoSerie: form.anoSerie,
      disciplinaIds: form.disciplinaIds,
    };
    try {
      if (editingId) {
        await turmasApi.update(editingId, payload);
      } else {
        await turmasApi.create(payload);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar');
    }
  };

  const handleDelete = async () => {
    await turmasApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Turmas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nova turma
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Ano/série</TableCell>
              <TableCell>Disciplinas</TableCell>
              <TableCell>Alunos</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turmas.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.nome}</TableCell>
                <TableCell>{t.anoSerie}</TableCell>
                <TableCell>
                  {t.disciplinas.map((d) => (
                    <Chip key={d.id} label={d.nome} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell>{t.alunos.length}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(t)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteTarget(t)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {turmas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhuma turma cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar turma' : 'Nova turma'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            autoFocus
          />
          <TextField
            label="Ano/série"
            value={form.anoSerie}
            onChange={(e) => setForm({ ...form, anoSerie: e.target.value })}
          />
          <TextField
            select
            label="Disciplinas"
            value={form.disciplinaIds}
            onChange={(e) => setForm({ ...form, disciplinaIds: e.target.value })}
            slotProps={{
              select: {
                multiple: true,
                renderValue: (selected) =>
                  disciplinas
                    .filter((d) => selected.includes(d.id))
                    .map((d) => d.nome)
                    .join(', '),
              },
            }}
          >
            {disciplinas.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.nome}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.nome || !form.anoSerie}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Excluir turma "${deleteTarget?.nome}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
