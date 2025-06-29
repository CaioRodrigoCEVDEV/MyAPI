const pool = require('../db/db.js');

exports.inserirGasto = async (req, res) => {
    const { ccid, catcod, descricao, valor, data, mesfat, usucod } = req.body;
    const v = parseFloat(valor.replace(',', '.'));
    try {
        const result = await pool.query(
            'INSERT INTO gastocredito (ccid, catcod, descricao, valor, data, mesfat, usucod) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [ccid, catcod, descricao, v, data, mesfat, usucod]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir gasto do cartao' });
    }
};

exports.listarGastos = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT g.gcid, g.descricao, g.valor, g.data, g.mesfat,
                    c.ccdes, cat.catdes
             FROM gastocredito g
             JOIN cartaocredito c ON c.cccod = g.ccid
             JOIN categoria cat ON cat.catcod = g.catcod
             WHERE g.usucod = $1
             ORDER BY g.data DESC`,
            [id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar gastos' });
    }
};


