const express = require('express');
const router = express.Router();
const cartaoGastoController = require('../controllers/cartaoGastoController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.post('/cartao/gasto', autenticarToken, cartaoGastoController.inserirGasto);
router.get('/cartao/gasto/:id', autenticarToken, cartaoGastoController.listarGastos);

module.exports = router;
