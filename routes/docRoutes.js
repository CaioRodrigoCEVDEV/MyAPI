const express = require('express');
const router = express.Router();
const docController = require('../controllers/docController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.post('/doc',autenticarToken, docController.criarDoc);
router.get('/doc/:id',autenticarToken, docController.listarDocs);
router.get('/docAnualRealizado/:id',autenticarToken, docController.listarDocsAnualRealizado);
router.get('/docAnualProvisionado/:id',autenticarToken, docController.listarDocsAnualRealizado);
router.get('/docPvsRatual/:id',autenticarToken, docController.listarDocsPvsRatual);
router.get('/doc/receitas',autenticarToken, docController.listarDocsReceitas);
router.get('/doc/despesas',autenticarToken, docController.listarDocsDespesas);
router.get('/doc/despesas/:id',autenticarToken, docController.listarDocsDespesasUser);
router.get('/doc/receitas/:id',autenticarToken, docController.listarDocsReceitasUser);
router.get('/doc/contaDespesaPendente/:id',autenticarToken, docController.contaDespesaPendente);
router.get('/doc/contaReceitaPendente/:id',autenticarToken, docController.contaReceitaPendente);
router.get('/doc/GastosHoje/:id',autenticarToken, docController.GastosHoje);
router.get('/doc/totalSeguro/:id',autenticarToken, docController.TotalSeguro);
router.get('/docid/:id',autenticarToken, docController.listarDocId);
router.get('/doc/despesasPorSta/:id',autenticarToken, docController.desepesasPorStatus);
router.get('/doc/receitasPorSta/:id',autenticarToken, docController.receitasPorStatus);
router.put('/docedit/:id',autenticarToken, docController.editarDoc);
router.put('/docstatus/:id',autenticarToken, docController.atualizarStatus);
router.put('/doc/:id',autenticarToken, docController.deletarDoc);
router.delete('/doc',autenticarToken, docController.deletarTodos);

module.exports = router;
