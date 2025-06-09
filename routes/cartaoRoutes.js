const express = require('express');
const router = express.Router();
const cartaoController = require('../controllers/cartaoController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.post('/cartao', autenticarToken, cartaoController.insertCartao);
router.get('/cartao/:id', autenticarToken, cartaoController.listarCartoes);

module.exports = router;
