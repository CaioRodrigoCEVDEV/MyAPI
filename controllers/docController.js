const pool = require('../db/db.js');

exports.criarDoc = async (req, res) => {
    const { docusucod, docnatcod, docsta, docdtlan, docv, doctccod, docnum, docobs, doccontacod, doccatcod,docdtpag } = req.body;

    const valor = parseFloat(docv.replace(',','.'));
    const agora = 'now()';
    try {
        const result = await pool.query(
            'INSERT INTO doc (docusucod,docnatcod,docsta,docdtlan,docv,doctccod,docnum,docobs,doccontacod,doccatcod,docdtpag) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [docusucod, docnatcod, docsta, agora, valor, doctccod, docnum, docobs, doccontacod, doccatcod,docdtpag]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir documento' });
    }

    try{
        if (docnatcod === 2 ){
        const atualizarContaReceita = await pool.query(
            'update conta set contavltotal = contavltotal + $1 where contacod = $2 and contausucod = $3',[valor,doccontacod,docusucod]
        );

        res.status(201).json(atualizarContaReceita.rows[0]);
        }else{
            const atualizarContaDespesa = await pool.query(
            'update conta set contavltotal = contavltotal - $1 where contacod = $2 and contausucod = $3',[valor,doccontacod,docusucod]
        );
        res.status(201).json(atualizarContaDespesa.rows[0]);
        }

    } catch (error){
        console.error(error);
        res.status(500).json({error: 'Erro ao atualizar saldo da conta'})
    }




};

exports.listarDocs = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('select doccod, docsta, tcdes, natdes, docv, docobs,contades,catdes from doc join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod where docusucod = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};


exports.listarDocsAnual = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('select * from vw_receita_vs_despesa_anual where docusucod = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};


exports.listarDocsPvsRAnual = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('select * from vw_orcado_vs_realizado_anual where docusucod = $1', [id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};

exports.listarDocsReceitas = async (req, res) => {
    try {
        const natureza = "Receita"
        const result = await pool.query('select doccod, docsta, tcdes, natdes, docv, docobs,contades,catdes from doc ' +
            'join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod ' +
            'where natdes = $1', [natureza]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};

exports.listarDocsDespesas = async (req, res) => {
    try {
        const natureza = "Despesa"
        const result = await pool.query('select docusucod,doccod, docsta, tcdes, natdes, docv, docobs,contades,catdes from doc ' +
            'join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod ' +
            'where natdes = $1', [natureza]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};



exports.listarDocsDespesasUser = async (req, res) => {
    const { id } = req.params;
    try {
        const natureza = "Despesa"
        const result = await pool.query('select docusucod,doccod, docsta, tcdes,docdtlan,docdtpag ::date, natdes, docv, docobs,contades,catdes from doc ' +
            'join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod ' +
            'where natdes = $1 and docusucod = $2', [natureza, id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};


exports.listarDocsReceitasUser = async (req, res) => {
    const { id } = req.params;
    try {
        const natureza = "Receita"
        const result = await pool.query('select docusucod,doccod, docsta, tcdes,docdtlan,docdtpag ::date, natdes, docv, docobs,contades,catdes from doc ' +
            'join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod ' +
            'where natdes = $1 and docusucod = $2', [natureza, id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};


exports.deletarDoc = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM doc WHERE doccod = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Documento não encontrado' });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar documento' });
    }
};

exports.deletarTodos = async (req, res) => {
    try {
        await pool.query('DELETE FROM doc');
        res.status(200).json({ message: 'Todos os documentos foram deletados' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar todos documentos' });
    }
};

