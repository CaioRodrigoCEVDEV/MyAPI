const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.get('/auth/listarlogin',autenticarToken, loginController.listarlogin);
router.post('/auth/register', loginController.cadastrarlogin);
router.post('/auth/login', loginController.validarLogin);
router.put('/auth/atualizarCadastro/:id',autenticarToken, loginController.atualizarCadastro);
module.exports = router;

