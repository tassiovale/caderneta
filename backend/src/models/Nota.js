const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Nota = sequelize.define('Nota', {
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  indexes: [
    { unique: true, fields: ['alunoId', 'avaliacaoId'] },
  ],
});

module.exports = Nota;
