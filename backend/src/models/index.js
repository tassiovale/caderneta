const sequelize = require('../config/database');
const Aluno = require('./Aluno');
const Turma = require('./Turma');
const Disciplina = require('./Disciplina');
const Avaliacao = require('./Avaliacao');
const Nota = require('./Nota');
const ConfiguracaoSistema = require('./ConfiguracaoSistema');

Turma.hasMany(Aluno, { foreignKey: 'turmaId', as: 'alunos' });
Aluno.belongsTo(Turma, { foreignKey: 'turmaId', as: 'turma' });

Turma.belongsToMany(Disciplina, { through: 'TurmaDisciplina', as: 'disciplinas' });
Disciplina.belongsToMany(Turma, { through: 'TurmaDisciplina', as: 'turmas' });

Turma.hasMany(Avaliacao, { foreignKey: 'turmaId', as: 'avaliacoes' });
Avaliacao.belongsTo(Turma, { foreignKey: 'turmaId', as: 'turma' });
Disciplina.hasMany(Avaliacao, { foreignKey: 'disciplinaId', as: 'avaliacoes' });
Avaliacao.belongsTo(Disciplina, { foreignKey: 'disciplinaId', as: 'disciplina' });

Aluno.hasMany(Nota, { foreignKey: 'alunoId', as: 'notas' });
Nota.belongsTo(Aluno, { foreignKey: 'alunoId', as: 'aluno' });
Avaliacao.hasMany(Nota, { foreignKey: 'avaliacaoId', as: 'notas', onDelete: 'CASCADE' });
Nota.belongsTo(Avaliacao, { foreignKey: 'avaliacaoId', as: 'avaliacao' });

module.exports = { sequelize, Aluno, Turma, Disciplina, Avaliacao, Nota, ConfiguracaoSistema };
