const pool = require('../db/db.js');

exports.InsertTC = async (req, res) => {
    const { tcdes,tcusucod } = req.body;
    try {
        const result = await pool.query('INSERT INTO tc (tcdes,tcusucod) VALUES ($1,$2) RETURNING *', [tcdes,tcusucod]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir tipo de categoria' });
    }
}

exports.listarTCs = async (req, res) => {
    //const { id } = req.params;
    const id = req.token.usucod;
    try {
        const result = await pool.query('SELECT tccod, tcdes FROM tc where tcusucod = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar tipos de categoria' });
    }
};

exports.deletarTC = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tc WHERE tccod = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tipo de categoria não encontrado' });
        }
        res.status(200).json({ message: 'Tipo de categoria deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar tipo de categoria' });
    }
}

exports.editarTC = async (req, res) => {
    const { id } = req.params;
    const { tcdes } = req.body;
    try {
        const result = await pool.query('UPDATE tc SET tcdes = $1 WHERE tccod = $2 RETURNING *', [tcdes, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tipo de categoria não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar tipo de categoria' });
    }
}

