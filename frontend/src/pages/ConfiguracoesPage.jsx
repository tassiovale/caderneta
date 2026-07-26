import { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, Alert, Paper } from '@mui/material';
import { configuracaoApi } from '../api';

function parseValor(v) {
  return Number(String(v).replace(',', '.'));
}

function mediaMinimaError(v) {
  if (v === '') return 'Média mínima é obrigatória';
  const n = parseValor(v);
  if (Number.isNaN(n) || n < 0 || n > 10) return 'Média mínima deve ser um número entre 0 e 10';
  return '';
}

export default function ConfiguracoesPage() {
  const [mediaMinima, setMediaMinima] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    configuracaoApi.get().then((c) => setMediaMinima(String(c.mediaMinima)));
  }, []);

  const erro = mediaMinimaError(mediaMinima);

  const handleSave = async () => {
    setFeedback(null);
    try {
      const c = await configuracaoApi.update({ mediaMinima: parseValor(mediaMinima) });
      setMediaMinima(String(c.mediaMinima));
      setFeedback({ type: 'success', msg: 'Configuração salva com sucesso' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.response?.data?.error || 'Erro ao salvar' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Configurações
      </Typography>

      {feedback && (
        <Alert severity={feedback.type} sx={{ mb: 2 }}>
          {feedback.msg}
        </Alert>
      )}

      <Paper sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TextField
          label="Média mínima para aprovação"
          value={mediaMinima}
          onChange={(e) => setMediaMinima(e.target.value)}
          error={!!erro}
          helperText={erro}
          sx={{ minWidth: 260 }}
        />
        <Button variant="contained" onClick={handleSave} disabled={!!erro}>
          Salvar
        </Button>
      </Paper>
    </Box>
  );
}
