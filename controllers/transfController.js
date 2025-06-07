const pool = require('../db/db.js');

exports.transferir = async (req, res) => {
    const {id} = req.params;
    const {contacoddest,doccontacod,docdtlan,docdtpag,docnatcod,docobs,docusucod,docv} = req.body;
    const valor = parseFloat(docv.replace(',','.'));
    const agora = 'now()';
    const naturezaD = 1;
    const naturezaR = 2;
    const sta = 'TR'
    try {
        const resultD = await pool.query('INSERT INTO doc (docsta, doccontacod,docdtlan,docdtpag,docnatcod,docobs,docusucod,docv) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', 
                                                        [sta,doccontacod,agora,docdtpag,naturezaD,docobs,docusucod,valor]);

        const atualizarContaDespesa = await pool.query('update conta set contavltotal = contavltotal - $1 where contacod = $2 and contausucod = $3', 
                                                        [valor, doccontacod, docusucod]);

        const resultR = await pool.query('INSERT INTO doc (docsta, doccontacod,docdtlan,docdtpag,docnatcod,docobs,docusucod,docv) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', 
                                                        [sta,contacoddest,agora,docdtpag,naturezaR,docobs,docusucod,valor]);

        const atualizarContaReceita = await pool.query('update conta set contavltotal = contavltotal + $1 where contacod = $2 and contausucod = $3', 
                                                        [valor, contacoddest, docusucod]);


        res.status(201).json(resultR.rows[0], resultD.rows[0],atualizarContaDespesa.rows[0],atualizarContaReceita.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao inserir TRANSf' });
    }
};