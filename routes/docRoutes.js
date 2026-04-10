const express = require('express');
const router = express.Router();
const docController = require('../controllers/docController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.post('/doc',autenticarToken, docController.criarDoc);

router.get('/doc/totalSeguro',autenticarToken, docController.TotalSeguro);

router.get('/doc/GastosHoje',autenticarToken, docController.GastosHoje);

router.get('/doc/contaDespesaPendente',autenticarToken, docController.contaDespesaPendente);
router.get('/doc/contaReceitaPendente',autenticarToken, docController.contaReceitaPendente);

router.get('/doc/despesasPorSta',autenticarToken, docController.desepesasPorStatus);
router.get('/doc/receitasPorSta',autenticarToken, docController.receitasPorStatus);

router.get('/docPvsRatual',autenticarToken, docController.listarDocsPvsRatual);

router.get('/docAnualProvisionado',autenticarToken, docController.listarDocsAnualProvisionado);
router.get('/docAnualRealizado',autenticarToken, docController.listarDocsAnualRealizado);

router.get('/doc',autenticarToken, docController.listarDocs);


router.get('/doc/receitas',autenticarToken, docController.listarDocsReceitas);
router.get('/doc/receitas/month/',autenticarToken, docController.listarDocsReceitasMonth);
router.get('/doc/despesas',autenticarToken, docController.listarDocsDespesas);
router.get('/doc/despesas/:id',autenticarToken, docController.listarDocsDespesasUser);
router.get('/doc/despesas/month/:id',autenticarToken, docController.listarDocsDespesasUserMonth);
router.get('/doc/receitas/:id',autenticarToken, docController.listarDocsReceitasUser);
router.get('/doc/receitas/month/:id',autenticarToken, docController.listarDocsReceitasUserMonth);
router.get('/docid/:id',autenticarToken, docController.listarDocId);
router.put('/docedit/:id',autenticarToken, docController.editarDoc);
router.put('/docstatus/:id',autenticarToken, docController.atualizarStatus);
router.put('/doc/:id',autenticarToken, docController.deletarDoc);
router.delete('/doc',autenticarToken, docController.deletarTodos);

module.exports = router;
