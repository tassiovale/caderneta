const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConfiguracaoSistema = sequelize.define('ConfiguracaoSistema', {
  mediaMinima: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 6.0,
  },
});

module.exports = ConfiguracaoSistema;
