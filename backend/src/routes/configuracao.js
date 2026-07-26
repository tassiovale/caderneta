const express = require('express');
const { ConfiguracaoSistema } = require('../models');

const router = express.Router();

async function getConfiguracao() {
  const [configuracao] = await ConfiguracaoSistema.findOrCreate({
    where: { id: 1 },
    defaults: { mediaMinima: 6.0 },
  });
  return configuracao;
}

router.get('/', async (req, res) => {
  const configuracao = await getConfiguracao();
  res.json(configuracao);
});

router.put('/', async (req, res) => {
  const mediaMinima = Number(req.body.mediaMinima);
  if (Number.isNaN(mediaMinima) || mediaMinima < 0 || mediaMinima > 10) {
    return res.status(400).json({ error: 'Média mínima deve ser um número entre 0 e 10' });
  }
  const configuracao = await getConfiguracao();
  await configuracao.update({ mediaMinima });
  res.json(configuracao);
});

module.exports = router;
