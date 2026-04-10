const express = require('express');
const router = express.Router();
const tcController = require('../controllers/tcController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.get('/tc',autenticarToken, tcController.listarTCs);
router.post('/tc',autenticarToken, tcController.InsertTC);
router.delete('/tc/:id',autenticarToken, tcController.deletarTC);
router.put('/tc/:id',autenticarToken, tcController.editarTC);

module.exports = router;
