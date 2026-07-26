const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Avaliacao = sequelize.define('Avaliacao', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  peso: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Avaliacao;
