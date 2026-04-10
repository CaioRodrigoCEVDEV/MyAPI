const express = require('express');
const router = express.Router();
const contaController = require('../controllers/contaController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.get('/contaSaldo', autenticarToken,contaController.contaSaldo);
router.get('/conta', autenticarToken,contaController.listarContasUser);

router.get('/contas', autenticarToken,contaController.listarContas);
router.post('/conta', autenticarToken,contaController.Insertconta);
router.delete('/conta/:id', autenticarToken,contaController.deletarConta);
router.put('/conta/:id', autenticarToken,contaController.editarConta);
router.get('/contaid/:id', autenticarToken,contaController.listarContasId);

module.exports = router;
