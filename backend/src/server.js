const { sequelize, ConfiguracaoSistema } = require('./models');
const app = require('./app');

const PORT = process.env.PORT || 3001;

sequelize.sync().then(async () => {
  await ConfiguracaoSistema.findOrCreate({ where: { id: 1 }, defaults: { mediaMinima: 6.0 } });
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
