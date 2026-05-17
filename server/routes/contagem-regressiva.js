var express = require('express');
var router = express.Router();

/* GET dados de data/hora para a contagem regressiva. */
router.get('/', function(req, res, next) {
  const dataAtual = new Date();
  const minutosRestantes = 1;
  const dataEvento = new Date(
    dataAtual.getTime() + minutosRestantes * 60 * 1000
  );

  console.log(dataAtual);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.json({
    "Data Atual": dataAtual,
    "Data Evento": dataEvento,
    "Minutos Restantes": minutosRestantes,
  });
});

module.exports = router;
