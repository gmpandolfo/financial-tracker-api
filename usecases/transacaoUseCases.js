const { pool } = require('../config');
const Transacao = require('../entities/Transacao');

const getTransacoesDB = async () => {
    try {
        const { rows } = await pool.query(`
        SELECT t.id_transacao as id_transacao, t.valor as valor, 
        to_char(t.data_transacao, 'YYYY-MM-DD HH24:MI:SS') as data_transacao, 
        t.especificacao as especificacao, t.id_categoria as id_categoria, 
        c.nome as categoria_nome
        FROM transacao t
        JOIN categoria c ON t.id_categoria = c.id_categoria
        ORDER BY t.id_transacao`);
        return rows.map((transacao) =>
            new Transacao(transacao.id_transacao, transacao.valor,
                transacao.data_transacao, transacao.especificacao, transacao.id_categoria, transacao.categoria_nome));
    } catch (err) {
        throw "Erro: " + err;
    }
}

const addTransacaoDB = async (body) => {
    try {
        const { valor, data_transacao, especificacao, id_categoria } = body;
        const results = await pool.query(`INSERT INTO transacao (valor, data_transacao, especificacao, id_categoria) 
            VALUES ($1, $2, $3, $4)
        RETURNING id_transacao, valor, to_char(data_transacao, 'YYYY-MM-DD HH24:MI:SS') as data_transacao, 
        especificacao, id_categoria`,
            [valor, data_transacao, especificacao, id_categoria]);
        const transacao = results.rows[0];
        return new Transacao(transacao.id_transacao, transacao.valor,
            transacao.data_transacao, transacao.especificacao, transacao.id_categoria, "");
    } catch (err) {
        throw "Erro ao inserir a transação: " + err;
    }
}

const updateTransacaoDB = async (body) => {
    try {
        const { id_transacao, valor, data_transacao, especificacao, id_categoria } = body;
        const results = await pool.query(`UPDATE transacao SET valor = $2, 
            data_transacao = $3, especificacao = $4, id_categoria = $5, data_transacao = CURRENT_TIMESTAMP
        WHERE id_transacao = $1 
        RETURNING id_transacao, valor, to_char(data_transacao, 'YYYY-MM-DD HH24:MI:SS') as data_transacao, 
        especificacao, id_categoria`,
            [id_transacao, valor, data_transacao, especificacao, id_categoria]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_transacao} para ser alterado`;
        }
        const transacao = results.rows[0];
        return new Transacao(transacao.id_transacao, transacao.valor,
            transacao.data_transacao, transacao.especificacao, transacao.id_categoria, "");
    } catch (err) {
        throw "Erro ao alterar a transação: " + err;
    }
}

const deleteTransacaoDB = async (id_transacao) => {
    try {
        const results = await pool.query(`DELETE FROM transacao
        WHERE id_transacao = $1`, [id_transacao]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_transacao} para ser removido`;
        } else {
            return `Transação de código ${id_transacao} removida com sucesso!`;
        }
    } catch (err) {
        throw "Erro ao remover a transação: " + err;
    }
}

const getTransacaoPorCodigoDB = async (id_transacao) => {
    try {
        const results = await pool.query(`SELECT t.id_transacao as id_transacao, 
            t.valor as valor, to_char(t.data_transacao, 'YYYY-MM-DD HH24:MI:SS') as data_transacao, 
            t.especificacao as especificacao, t.id_categoria as id_categoria, 
            c.nome as categoria_nome
            FROM transacao t JOIN categoria c ON t.id_categoria = c.id_categoria
            WHERE t.id_transacao = $1`, [id_transacao]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_transacao}`;
        } else {
            const transacao = results.rows[0];
            return new Transacao(transacao.id_transacao, transacao.valor,
                transacao.data_transacao, transacao.especificacao, transacao.id_categoria, transacao.categoria_nome);
        }
    } catch (err) {
        throw "Erro ao recuperar a transação: " + err;
    }
}

module.exports = {
    getTransacoesDB, addTransacaoDB, updateTransacaoDB, deleteTransacaoDB, 
    getTransacaoPorCodigoDB
}