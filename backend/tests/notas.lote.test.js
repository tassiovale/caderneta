process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const { sequelize, Turma, Disciplina, Avaliacao, Aluno, Nota } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

test('POST /api/notas/lote rejeita nota maior que 10', async () => {
  const turma = await Turma.create({ nome: 'Turma A', anoSerie: '1º ano' });
  const disciplina = await Disciplina.create({ nome: 'Matemática' });
  const avaliacao = await Avaliacao.create({ nome: 'Prova 1', peso: 1, turmaId: turma.id, disciplinaId: disciplina.id });
  const aluno = await Aluno.create({ nome: 'Fulano', matricula: '123' });

  const res = await request(app)
    .post('/api/notas/lote')
    .send({ avaliacaoId: avaliacao.id, notas: [{ alunoId: aluno.id, valor: 50 }] });

  expect(res.status).toBe(400);

  const notaSalva = await Nota.findOne({ where: { alunoId: aluno.id, avaliacaoId: avaliacao.id } });
  expect(notaSalva).toBeNull();
});
