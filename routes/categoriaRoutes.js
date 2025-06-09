const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const autenticarToken = require('../src/middleware/authMiddleware');

router.get('/catReceita/:id',autenticarToken , categoriaController.listarCategoriaReceita);
router.get('/catDespesa/:id',autenticarToken , categoriaController.listarCategoriaDespesaLA);
router.get('/catTodos/:id',autenticarToken , categoriaController.listarcatTodos);
router.get('/catTodosReceita/:id',autenticarToken , categoriaController.listarcatTodosReceita);
router.get('/catTodosDespesa/:id',autenticarToken , categoriaController.listarcatTodosDespesa);
router.post('/catInsert',autenticarToken , categoriaController.InsertCategoria);
router.delete('/cat/:id',autenticarToken , categoriaController.deletarCategoria);
router.put('/cat/:id',autenticarToken , categoriaController.editarCategoria);


module.exports = router;
