const express = require('express');
const { Turma, Disciplina, Avaliacao, Nota, Aluno, ConfiguracaoSistema } = require('../models');

const router = express.Router();

async function getMediaMinima() {
  const [configuracao] = await ConfiguracaoSistema.findOrCreate({
    where: { id: 1 },
    defaults: { mediaMinima: 6.0 },
  });
  return configuracao.mediaMinima;
}

router.get('/', async (req, res) => {
  const { turmaId, disciplinaId } = req.query;
  if (!turmaId || !disciplinaId) {
    return res.status(400).json({ error: 'Turma e disciplina são obrigatórias' });
  }

  const turma = await Turma.findByPk(turmaId, { include: [{ model: Aluno, as: 'alunos' }] });
  if (!turma) return res.status(400).json({ error: 'Turma informada não existe' });
  const disciplina = await Disciplina.findByPk(disciplinaId);
  if (!disciplina) return res.status(400).json({ error: 'Disciplina informada não existe' });

  const avaliacoes = await Avaliacao.findAll({ where: { turmaId, disciplinaId } });
  const pesoTotal = avaliacoes.reduce((soma, a) => soma + a.peso, 0);
  const mediaMinima = await getMediaMinima();

  const resultado = await Promise.all(
    turma.alunos.map(async (aluno) => {
      const notas = await Nota.findAll({
        where: { alunoId: aluno.id, avaliacaoId: avaliacoes.map((a) => a.id) },
      });
      const notaPorAvaliacao = new Map(notas.map((n) => [n.avaliacaoId, n.valor]));

      let somaPonderada = 0;
      let pesoLancado = 0;
      avaliacoes.forEach((a) => {
        if (notaPorAvaliacao.has(a.id)) {
          somaPonderada += notaPorAvaliacao.get(a.id) * a.peso;
          pesoLancado += a.peso;
        }
      });

      let media = null;
      let status = 'sem notas';
      if (pesoLancado > 0) {
        media = somaPonderada / pesoLancado;
        if (pesoLancado >= pesoTotal) {
          status = media >= mediaMinima ? 'aprovado' : 'reprovado';
        } else {
          status = 'em andamento';
        }
      }

      return {
        alunoId: aluno.id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        media,
        status,
      };
    }),
  );

  res.json(resultado);
});

module.exports = router;
