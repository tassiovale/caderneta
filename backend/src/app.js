const express = require('express');
const cors = require('cors');
const alunosRouter = require('./routes/alunos');
const turmasRouter = require('./routes/turmas');
const disciplinasRouter = require('./routes/disciplinas');
const avaliacoesRouter = require('./routes/avaliacoes');
const notasRouter = require('./routes/notas');
const configuracaoRouter = require('./routes/configuracao');
const mediasRouter = require('./routes/medias');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/alunos', alunosRouter);
app.use('/api/turmas', turmasRouter);
app.use('/api/disciplinas', disciplinasRouter);
app.use('/api/avaliacoes', avaliacoesRouter);
app.use('/api/notas', notasRouter);
app.use('/api/configuracao', configuracaoRouter);
app.use('/api/medias', mediasRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
