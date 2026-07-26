const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Disciplina = sequelize.define('Disciplina', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargaHoraria: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Disciplina;
