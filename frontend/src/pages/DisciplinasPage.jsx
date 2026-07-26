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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { disciplinasApi } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';

const emptyForm = { nome: '', cargaHoraria: '' };

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => disciplinasApi.list().then(setDisciplinas);

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setFormOpen(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({ nome: d.nome, cargaHoraria: d.cargaHoraria ?? '' });
    setError('');
    setFormOpen(true);
  };

  const handleSave = async () => {
    setError('');
    const payload = {
      nome: form.nome,
      cargaHoraria: form.cargaHoraria === '' ? null : Number(form.cargaHoraria),
    };
    try {
      if (editingId) {
        await disciplinasApi.update(editingId, payload);
      } else {
        await disciplinasApi.create(payload);
      }
      setFormOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar');
    }
  };

  const handleDelete = async () => {
    await disciplinasApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Disciplinas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Nova disciplina
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Carga horária</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplinas.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.nome}</TableCell>
                <TableCell>{d.cargaHoraria ?? '-'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(d)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteTarget(d)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {disciplinas.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhuma disciplina cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar disciplina' : 'Nova disciplina'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            autoFocus
          />
          <TextField
            label="Carga horária (horas)"
            type="number"
            value={form.cargaHoraria}
            onChange={(e) => setForm({ ...form, cargaHoraria: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.nome}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Excluir disciplina "${deleteTarget?.nome}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
