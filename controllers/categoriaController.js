const pool = require('../db/db.js');

exports.InsertCategoria = async (req, res) => {
    const { catusucod,catdes,cattipo } = req.body;
    try {
        const result = await pool.query('insert into categoria (catusucod,catdes,cattipo) values ($1, $2,$3) RETURNING *', [catusucod ,catdes,cattipo]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir categoria' });
    }
};


exports.listarcatTodos = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('select catcod,catdes,cattipo from categoria where catusucod = $1 order by catcod', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
};

exports.listarcatTodosReceita = async (req, res) => {
    const { id } = req.params;
    const R = "R";
    try {
        const result = await pool.query('select catcod,catdes,cattipo from categoria where cattipo = $1 and catusucod = $2 order by catcod', [R,id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
};

exports.listarcatTodosDespesa = async (req, res) => {
    const { id } = req.params;
    const D = "D";
    try {
        const result = await pool.query('select catcod,catdes,cattipo from categoria where cattipo = $1 and catusucod = $2 order by catcod', [D,id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
};



exports.listarCategoriaReceita = async (req, res) => {
    const { id } = req.params;
    try {
        const r = "R"
        const ex = "EX"
        const result = await pool.query(
            `select catcod, catdes, cattipo, sum(docv) as docv
             from categoria
             join doc on doccatcod = catcod
             where cattipo = $1
               and catusucod = $2
               and docsta <> $3
               and date_trunc('month', docdtlan) = date_trunc('month', CURRENT_DATE)
             group by catcod, catdes, cattipo`,
            [r, id, ex]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
};

exports.listarCat = async (req, res) => {
    try {
        const r = "R"
        const result = await pool.query('select catcod,catdes,cattipo from categoria order by catcod');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
};

exports.listarCategoriaDespesaLA = async (req, res) => {
    const { id } = req.params;
    try {
        const d = "D"
        const LA = "LA"
        //const result = await pool.query('select catcod,catdes,cattipo,docv from categoria join doc on doccatcod = catcod where cattipo = $1 and catusucod = $2 order by catcod', [d,id]);
        const result = await pool.query(
            `select catcod, catdes, cattipo, sum(docv) as docv
             from categoria
             join doc on doccatcod = catcod
             where cattipo = $1
               and catusucod = $2
               and docsta = $3
               and date_trunc('month', docdtpag) = date_trunc('month', CURRENT_DATE)
             group by catcod, catdes, cattipo`,
            [d, id, LA]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
};

exports.deletarCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('delete from categoria where catcod = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Categoria não encontrado' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
};

exports.editarCategoria = async (req, res) => {
    const { id } = req.params;
    const { catdes } = req.body;
    try {
        const result = await pool.query('update categoria set catdes = $1 WHERE catcod = $2 RETURNING *', [catdes, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar Categoria' });
    }
};