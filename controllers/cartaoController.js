const pool = require('../db/db.js');

exports.insertCartao = async (req, res) => {
    const { ccusucod, ccdes, cclimite, ccfechamento, ccvencimento } = req.body;
    const limite = parseFloat(cclimite.replace(',', '.'));
    const fechamento = parseInt(ccfechamento, 10);
    const vencimento = parseInt(ccvencimento, 10);
    try {
        const result = await pool.query(
            'INSERT INTO cartaocredito (ccusucod, ccdes, cclimite, ccfechamento, ccvencimento) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [ccusucod, ccdes, limite, fechamento, vencimento]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir cartao de credito' });
    }
};

exports.listarCartoes = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM cartaocredito WHERE ccusucod = $1 ORDER BY cccod', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar cartoes' });
    }
};

