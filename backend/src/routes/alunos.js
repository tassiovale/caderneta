const express = require('express');
const { Aluno, Turma } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const where = {};
  if (req.query.turmaId) where.turmaId = req.query.turmaId;
  const alunos = await Aluno.findAll({
    where,
    include: [{ model: Turma, as: 'turma' }],
    order: [['nome', 'ASC']],
  });
  res.json(alunos);
});

router.get('/:id', async (req, res) => {
  const aluno = await Aluno.findByPk(req.params.id, { include: [{ model: Turma, as: 'turma' }] });
  if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
  res.json(aluno);
});

router.post('/', async (req, res) => {
  const { nome, matricula, dataNascimento, turmaId } = req.body;
  if (!nome || !matricula) return res.status(400).json({ error: 'Nome e matrícula são obrigatórios' });
  if (turmaId) {
    const turma = await Turma.findByPk(turmaId);
    if (!turma) return res.status(400).json({ error: 'Turma informada não existe' });
  }
  try {
    const aluno = await Aluno.create({ nome, matricula, dataNascimento, turmaId: turmaId || null });
    const result = await Aluno.findByPk(aluno.id, { include: [{ model: Turma, as: 'turma' }] });
    res.status(201).json(result);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Matrícula já cadastrada' });
    }
    throw err;
  }
});

router.put('/:id', async (req, res) => {
  const aluno = await Aluno.findByPk(req.params.id);
  if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
  const { nome, matricula, dataNascimento, turmaId } = req.body;
  if (!nome || !matricula) return res.status(400).json({ error: 'Nome e matrícula são obrigatórios' });
  if (turmaId) {
    const turma = await Turma.findByPk(turmaId);
    if (!turma) return res.status(400).json({ error: 'Turma informada não existe' });
  }
  try {
    await aluno.update({ nome, matricula, dataNascimento, turmaId: turmaId || null });
    const result = await Aluno.findByPk(aluno.id, { include: [{ model: Turma, as: 'turma' }] });
    res.json(result);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Matrícula já cadastrada' });
    }
    throw err;
  }
});

router.delete('/:id', async (req, res) => {
  const aluno = await Aluno.findByPk(req.params.id);
  if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
  await aluno.destroy();
  res.status(204).send();
});

module.exports = router;
