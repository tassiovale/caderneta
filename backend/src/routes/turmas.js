const express = require('express');
const { Turma, Disciplina, Aluno } = require('../models');

const router = express.Router();

const includeOptions = [
  { model: Disciplina, as: 'disciplinas' },
  { model: Aluno, as: 'alunos' },
];

router.get('/', async (req, res) => {
  const turmas = await Turma.findAll({ include: includeOptions, order: [['nome', 'ASC']] });
  res.json(turmas);
});

router.get('/:id', async (req, res) => {
  const turma = await Turma.findByPk(req.params.id, { include: includeOptions });
  if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });
  res.json(turma);
});

router.post('/', async (req, res) => {
  const { nome, anoSerie, disciplinaIds } = req.body;
  if (!nome || !anoSerie) return res.status(400).json({ error: 'Nome e ano/série são obrigatórios' });
  const turma = await Turma.create({ nome, anoSerie });
  if (Array.isArray(disciplinaIds)) {
    await turma.setDisciplinas(disciplinaIds);
  }
  const result = await Turma.findByPk(turma.id, { include: includeOptions });
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const turma = await Turma.findByPk(req.params.id);
  if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });
  const { nome, anoSerie, disciplinaIds } = req.body;
  if (!nome || !anoSerie) return res.status(400).json({ error: 'Nome e ano/série são obrigatórios' });
  await turma.update({ nome, anoSerie });
  if (Array.isArray(disciplinaIds)) {
    await turma.setDisciplinas(disciplinaIds);
  }
  const result = await Turma.findByPk(turma.id, { include: includeOptions });
  res.json(result);
});

router.delete('/:id', async (req, res) => {
  const turma = await Turma.findByPk(req.params.id);
  if (!turma) return res.status(404).json({ error: 'Turma não encontrada' });
  await turma.destroy();
  res.status(204).send();
});

module.exports = router;
