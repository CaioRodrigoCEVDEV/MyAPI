const pool = require('../db/db.js');

exports.Insertconta = async (req, res) => {
    const {contausucod, contades,contatipo,contavltotal } = req.body;
    try {
        const result = await pool.query('insert into conta (contausucod,contades,contatipo,contavltotal) values ($1, $2, $3, $4) RETURNING *', [contausucod,contades,contatipo,contavltotal]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir conta' });
    }
};

exports.listarConta = async (req, res) => {
    try {
        const result = await pool.query('select contacod,contades,contatipo,contavltotal from conta');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar conta' });
    }
};



exports.listarContas = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('select contacod,contades,contatipodes,contavltotal FROM conta join contatipo on contatipocod = contatipo where contausucod = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar conta' });
    }
};


exports.listarContasUser = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('select contacod,contades,contatipodes,contavltotal FROM conta join contatipo on contatipocod = contatipo where contausucod = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar conta' });
    }
};



exports.deletarConta = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('delete from conta where contacod = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Documento não encontrado' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar documento' });
    }
};






exports.editarConta = async (req, res) => {
    const { id } = req.params;
    const { contades } = req.body;
    try {
        const result = await pool.query('UPDATE conta SET tcdes = $1 WHERE contacod = $2 RETURNING *', [contades, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar conta' });
    }
};



exports.contaSaldo = async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('select saldo_final from vw_saldo where usu = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar conta' });
    }
};
