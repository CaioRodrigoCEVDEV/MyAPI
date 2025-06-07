const express = require('express');
const router = express.Router();
const transfController = require('../controllers/transfController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.post('/transferencia/:id',autenticarToken, transfController.transferir);

module.exports = router;
