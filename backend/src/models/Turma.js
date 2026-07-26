const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turma = sequelize.define('Turma', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  anoSerie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Turma;
