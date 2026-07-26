const express = require('express');
const { Avaliacao, Turma, Disciplina, Nota } = require('../models');

const router = express.Router();

const includeOptions = [
  { model: Turma, as: 'turma' },
  { model: Disciplina, as: 'disciplina' },
];

async function validarTurmaEDisciplina(turmaId, disciplinaId) {
  const turma = await Turma.findByPk(turmaId, { include: [{ model: Disciplina, as: 'disciplinas' }] });
  if (!turma) return 'Turma informada não existe';
  const disciplina = await Disciplina.findByPk(disciplinaId);
  if (!disciplina) return 'Disciplina informada não existe';
  if (!turma.disciplinas.some((d) => d.id === disciplina.id)) {
    return 'Disciplina informada não está associada à turma';
  }
  return null;
}

async function somaPesos(turmaId, disciplinaId, excluirId) {
  const avaliacoes = await Avaliacao.findAll({ where: { turmaId, disciplinaId } });
  return avaliacoes
    .filter((a) => a.id !== excluirId)
    .reduce((soma, a) => soma + a.peso, 0);
}

router.get('/', async (req, res) => {
  const where = {};
  if (req.query.turmaId) where.turmaId = req.query.turmaId;
  if (req.query.disciplinaId) where.disciplinaId = req.query.disciplinaId;
  const avaliacoes = await Avaliacao.findAll({ where, include: includeOptions, order: [['nome', 'ASC']] });
  res.json(avaliacoes);
});

router.get('/:id', async (req, res) => {
  const avaliacao = await Avaliacao.findByPk(req.params.id, { include: includeOptions });
  if (!avaliacao) return res.status(404).json({ error: 'Avaliação não encontrada' });
  res.json(avaliacao);
});

router.post('/', async (req, res) => {
  const { nome, peso, turmaId, disciplinaId } = req.body;
  if (!nome || !peso || !turmaId || !disciplinaId) {
    return res.status(400).json({ error: 'Nome, peso, turma e disciplina são obrigatórios' });
  }
  if (peso <= 0) return res.status(400).json({ error: 'Peso deve ser maior que zero' });

  const erroAssociacao = await validarTurmaEDisciplina(turmaId, disciplinaId);
  if (erroAssociacao) return res.status(400).json({ error: erroAssociacao });

  const soma = await somaPesos(turmaId, disciplinaId);
  if (soma + peso > 100) {
    return res.status(400).json({ error: `Soma dos pesos ultrapassa 100 (disponível: ${100 - soma})` });
  }

  const avaliacao = await Avaliacao.create({ nome, peso, turmaId, disciplinaId });
  const result = await Avaliacao.findByPk(avaliacao.id, { include: includeOptions });
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const avaliacao = await Avaliacao.findByPk(req.params.id);
  if (!avaliacao) return res.status(404).json({ error: 'Avaliação não encontrada' });

  const { nome, peso, turmaId, disciplinaId } = req.body;
  if (!nome || !peso || !turmaId || !disciplinaId) {
    return res.status(400).json({ error: 'Nome, peso, turma e disciplina são obrigatórios' });
  }
  if (peso <= 0) return res.status(400).json({ error: 'Peso deve ser maior que zero' });

  const erroAssociacao = await validarTurmaEDisciplina(turmaId, disciplinaId);
  if (erroAssociacao) return res.status(400).json({ error: erroAssociacao });

  const soma = await somaPesos(turmaId, disciplinaId, avaliacao.id);
  if (soma + peso > 100) {
    return res.status(400).json({ error: `Soma dos pesos ultrapassa 100 (disponível: ${100 - soma})` });
  }

  await avaliacao.update({ nome, peso, turmaId, disciplinaId });
  const result = await Avaliacao.findByPk(avaliacao.id, { include: includeOptions });
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const avaliacao = await Avaliacao.findByPk(req.params.id);
  if (!avaliacao) return res.status(404).json({ error: 'Avaliação não encontrada' });
  await Nota.destroy({ where: { avaliacaoId: avaliacao.id } });
  await avaliacao.destroy();
  res.status(204).send();
});

module.exports = router;
