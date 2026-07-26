const express = require('express');
const { Nota, Aluno, Avaliacao } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const where = {};
  if (req.query.avaliacaoId) where.avaliacaoId = req.query.avaliacaoId;
  const notas = await Nota.findAll({
    where,
    include: [{ model: Aluno, as: 'aluno' }],
    order: [['alunoId', 'ASC']],
  });
  res.json(notas);
});

router.post('/lote', async (req, res) => {
  const { avaliacaoId, notas } = req.body;
  if (!avaliacaoId || !Array.isArray(notas)) {
    return res.status(400).json({ error: 'Avaliação e notas são obrigatórias' });
  }

  const avaliacao = await Avaliacao.findByPk(avaliacaoId);
  if (!avaliacao) return res.status(400).json({ error: 'Avaliação informada não existe' });

  for (const item of notas) {
    const valor = Number(item.valor);
    if (!item.alunoId || Number.isNaN(valor) || valor < 0 || valor > 10) {
      return res.status(400).json({ error: 'Todas as notas devem ser números entre 0 e 10' });
    }
  }

  for (const item of notas) {
    const valor = Number(item.valor);
    const existente = await Nota.findOne({ where: { alunoId: item.alunoId, avaliacaoId } });
    if (existente) {
      await existente.update({ valor });
    } else {
      await Nota.create({ alunoId: item.alunoId, avaliacaoId, valor });
    }
  }

  const result = await Nota.findAll({
    where: { avaliacaoId },
    include: [{ model: Aluno, as: 'aluno' }],
    order: [['alunoId', 'ASC']],
  });
  res.json(result);
});

module.exports = router;
