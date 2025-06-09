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
        if (docnatcod === 2 && docsta === 'BA') {
            const atualizarContaReceita = await pool.query(
                'update conta set contavltotal = contavltotal + $1 where contacod = $2 and contausucod = $3', [valor, doccontacod, docusucod]
            );

            res.status(201).json(atualizarContaReceita.rows[0]);
        } else if (docnatcod === 1 && docsta === 'BA') {
            const atualizarContaDespesa = await pool.query(
                'update conta set contavltotal = contavltotal - $1 where contacod = $2 and contausucod = $3', [valor, doccontacod, docusucod]
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
        const result = await pool.query("select doccod, docsta, case when tcdes is null then '' else tcdes end as tcdes,  natdes, docv, docobs,contades,case when catdes is null then '' else catdes end as catdes from doc join natureza on natcod = docnatcod " +
            "left join tc on tccod = doctccod " +
            "left join conta on contacod = doccontacod " +
            "left join categoria on catcod = doccatcod where docusucod = $1 order by doccod desc", [id]);
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
        const natureza = "Receita";
        const ex = "EX";
        const result = await pool.query('select doccod, docsta, tcdes, natdes, docv, docobs,contades,catdes from doc ' +
            'join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod ' +
            'where natdes = $1 and docsta <> $2', [natureza,ex]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};

exports.listarDocsDespesas = async (req, res) => {
    try {
        const natureza = "Despesa";
        const ex = "EX";
        const result = await pool.query('select docusucod,doccod, docsta, tcdes, natdes, docv, docobs,contades,catdes from doc ' +
            'join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod ' +
            'where natdes = $1 and docsta <> $2', [natureza,ex]);
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
        const ex = "EX";
        const result = await pool.query('select docusucod,doccod, docsta, tcdes,docdtlan,docdtpag ::date, natdes, docv, docobs,contades,catdes from doc ' +
            'join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod ' +
            'where natdes = $1 and docusucod = $2 and docsta <> $3 order by doccod desc', [natureza, id,ex]);
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
        const ex = "EX";
        const result = await pool.query('select docusucod,doccod, docsta, tcdes,docdtlan,docdtpag ::date, natdes, docv, docobs,contades,catdes from doc ' +
            'join natureza on natcod = docnatcod ' +
            'join tc on tccod = doctccod ' +
            'join conta on contacod = doccontacod ' +
            'left join categoria on catcod = doccatcod ' +
            'where natdes = $1 and docusucod = $2 and docsta <> $3 order by doccod desc', [natureza, id,ex]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar documentos' });
    }
};


exports.deletarDoc = async (req, res) => {
    const { id } = req.params;
    const ex = 'EX';
    try {
        const staAnteriorResult = await pool.query('select docsta from doc where doccod = $1', [id]);
        const staAnterior = staAnteriorResult.rows[0];
        console.log(staAnterior);
        const result = await pool.query('update doc set docsta = $1 WHERE doccod = $2 RETURNING *', [ex, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Documento não encontrado' });

        const lancamentoexResult = await pool.query('select docv,doccontacod,docnatcod,docusucod,docsta from doc where doccod = $1', [id]);
        const lancamentoex = lancamentoexResult.rows[0];


        if (!lancamentoex) {
            return res.status(404).json({ error: 'Lançamento não encontrado' });
        }

        try {
            if (lancamentoex.docnatcod === 2 && staAnterior.docsta === 'BA') {
                await pool.query(
                    'update conta set contavltotal = contavltotal - $1 where contacod = $2 and contausucod = $3',
                    [lancamentoex.docv, lancamentoex.doccontacod, lancamentoex.docusucod]
                );
            } else if (lancamentoex.docnatcod === 1 && staAnterior.docsta === 'BA'){
                await pool.query(
                    'update conta set contavltotal = contavltotal + $1 where contacod = $2 and contausucod = $3',
                    [lancamentoex.docv, lancamentoex.doccontacod, lancamentoex.docusucod]
                );
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'erro ao atualizar saldo' });
        }

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

// Retorna um único lançamento pelo código
exports.listarDocId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('select * from doc where doccod = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Documento não encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar documento' });
    }
};

// Edita dados do lançamento
exports.editarDoc = async (req, res) => {
    const { id } = req.params;
    const { doctccod, doccontacod, doccatcod, docv, docobs, docdtpag, docsta } = req.body;
    const valor = parseFloat(docv.replace(',', '.'));
    try {
        // Busca dados atuais do lançamento para ajustar o saldo quando necessário
        const busca = await pool.query(
            'select docsta, docv, doccontacod, docnatcod, docusucod from doc where doccod = $1',
            [id]
        );
        if (busca.rowCount === 0) {
            return res.status(404).json({ error: 'Documento não encontrado' });
        }
        const docAnterior = busca.rows[0];

        const result = await pool.query(
            'update doc set doctccod=$1, doccontacod=$2, doccatcod=$3, docv=$4, docobs=$5, docdtpag=$6, docsta=$7 where doccod=$8 RETURNING *',
            [doctccod, doccontacod, doccatcod, valor, docobs, docdtpag, docsta, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Documento não encontrado' });
        }

        try {
            // Reverte o efeito anterior se o lançamento estava baixado
            if (docAnterior.docsta === 'BA') {
                if (docAnterior.docnatcod === 2) {
                    await pool.query(
                        'update conta set contavltotal = contavltotal - $1 where contacod = $2 and contausucod = $3',
                        [docAnterior.docv, docAnterior.doccontacod, docAnterior.docusucod]
                    );
                } else if (docAnterior.docnatcod === 1) {
                    await pool.query(
                        'update conta set contavltotal = contavltotal + $1 where contacod = $2 and contausucod = $3',
                        [docAnterior.docv, docAnterior.doccontacod, docAnterior.docusucod]
                    );
                }
            }

            // Aplica o novo efeito caso o lançamento esteja baixado
            if (docsta === 'BA') {
                if (docAnterior.docnatcod === 2) {
                    await pool.query(
                        'update conta set contavltotal = contavltotal + $1 where contacod = $2 and contausucod = $3',
                        [valor, doccontacod, docAnterior.docusucod]
                    );
                } else if (docAnterior.docnatcod === 1) {
                    await pool.query(
                        'update conta set contavltotal = contavltotal - $1 where contacod = $2 and contausucod = $3',
                        [valor, doccontacod, docAnterior.docusucod]
                    );
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar saldo' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar documento' });
    }
};

// Atualiza status do lançamento pendente para BA e ajusta o saldo da conta
exports.atualizarStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const busca = await pool.query('select docsta, docnatcod, docv, doccontacod, docusucod from doc where doccod = $1', [id]);
        if (busca.rowCount === 0) {
            return res.status(404).json({ error: 'Documento não encontrado' });
        }
        const doc = busca.rows[0];
        if (doc.docsta === 'BA') {
            return res.status(400).json({ error: 'Documento já baixado' });
        }

        await pool.query('update doc set docsta = $1 where doccod = $2', ['BA', id]);

        if (doc.docnatcod === 2) {
            await pool.query('update conta set contavltotal = contavltotal + $1 where contacod = $2 and contausucod = $3',
                [doc.docv, doc.doccontacod, doc.docusucod]);
        } else if (doc.docnatcod === 1) {
            await pool.query('update conta set contavltotal = contavltotal - $1 where contacod = $2 and contausucod = $3',
                [doc.docv, doc.doccontacod, doc.docusucod]);
        }

        res.status(200).json({ message: 'Status atualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
};


exports.contaDespesaPendente = async (req, res) => {
    const {id} = req.params;
    const natureza = "Despesa"
    const LA = "LA";
    try {
        const result = await pool.query('select sum(docv) as total from doc join natureza on natcod = docnatcod where natdes = $1 and docsta = $2 and docusucod = $3', [natureza,LA,id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar conta' });
    }
};

exports.contaReceitaPendente = async (req, res) => {
    const {id} = req.params;
    const natureza = "Receita"
    const LA = "LA";
    try {
        const result = await pool.query('select sum(docv) as total from doc join natureza on natcod = docnatcod where natdes = $1 and docsta = $2 and docusucod = $3', [natureza,LA,id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar conta' });
    }
};