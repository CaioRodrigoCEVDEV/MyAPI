const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.get('/catReceitaLA',autenticarToken , categoriaController.listarCategoriaReceitaLA);
router.get('/catDespesaBA',autenticarToken , categoriaController.listarCategoriaDespesaBA);
router.get('/catReceita',autenticarToken , categoriaController.listarCategoriaReceitaBA);
router.get('/catDespesa',autenticarToken , categoriaController.listarCategoriaDespesaLA);

router.get('/catTodosReceita',autenticarToken , categoriaController.listarcatTodosReceita);
router.get('/catTodosDespesa',autenticarToken , categoriaController.listarcatTodosDespesa);
router.get('/catTodos',autenticarToken , categoriaController.listarcatTodos);
router.post('/catInsert',autenticarToken , categoriaController.InsertCategoria);
router.put('/cat/:id',autenticarToken , categoriaController.editarCategoria);
router.delete('/cat/:id',autenticarToken , categoriaController.deletarCategoria);



module.exports = router;
