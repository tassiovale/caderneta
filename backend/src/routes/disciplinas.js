const express = require('express');
const { Disciplina } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  const disciplinas = await Disciplina.findAll({ order: [['nome', 'ASC']] });
  res.json(disciplinas);
});

router.get('/:id', async (req, res) => {
  const disciplina = await Disciplina.findByPk(req.params.id);
  if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada' });
  res.json(disciplina);
});

router.post('/', async (req, res) => {
  const { nome, cargaHoraria } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  const disciplina = await Disciplina.create({ nome, cargaHoraria });
  res.status(201).json(disciplina);
});

router.put('/:id', async (req, res) => {
  const disciplina = await Disciplina.findByPk(req.params.id);
  if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada' });
  const { nome, cargaHoraria } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  await disciplina.update({ nome, cargaHoraria });
  res.json(disciplina);
});

router.delete('/:id', async (req, res) => {
  const disciplina = await Disciplina.findByPk(req.params.id);
  if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada' });
  await disciplina.destroy();
  res.status(204).send();
});

module.exports = router;
