const { pool } = require('../config');
const Transacao = require('../entities/Transacao');

const getTransacoesDB = async () => {
    try {
        const { rows } = await pool.query(`SELECT id_transacao, especificacao, valor, 
                   to_char(data_transacao, 'YYYY-MM-DD') as data_transacao FROM transacao ORDER BY especificacao`);
        return rows.map((transacao) => new Transacao(transacao.id_transacao, transacao.especificacao, transacao.valor, transacao.data_transacao));
    } catch (err) {
        throw "Erro: " + err;
    }
}

const addTransacaoDB = async (body) => {
    try {
        const { especificacao, valor, data_transacao } = body;

        const results = await pool.query(`INSERT INTO transacao (especificacao, valor, data_transacao) VALUES ($1, $2, $3) RETURNING id_transacao, especificacao, valor, to_char(data_transacao, 'YYYY-MM-DD') as data_transacao`, [especificacao, valor, data_transacao]);
        const transacao = results.rows[0];
        return new Transacao(transacao.id_transacao, transacao.especificacao, transacao.valor, transacao.data_transacao);
    } catch (err) {
        throw "Erro ao inserir a transacao: " + err;
    }
}

const updateTransacaoDB = async (body) => {
    try {
        const { id_transacao, especificacao, valor, data_transacao } = body;

        const results = await pool.query(`UPDATE transacao SET valor = $3, data_transacao = $4, especificacao = $2 WHERE id_transacao = $1 RETURNING id_transacao, especificacao, valor, to_char(data_transacao, 'YYYY-MM-DD') as data_transacao`,
        [id_transacao, especificacao, valor, data_transacao]);

        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_categoria} para ser alterado`;
        }
        const transacao = results.rows[0];
        return new Transacao(transacao.id_transacao, transacao.especificacao, transacao.valor, transacao.data_transacao);
    } catch (err) {
        throw "Erro ao alterar a transação: " + err;
    }
}

const deleteTransacaoDB = async (id_transacao) => {
    try {
       const results = await pool.query(`DELETE FROM transacao WHERE id_transacao = $1`, [id_transacao]);
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
        const results = await pool.query(`SELECT id_transacao, especificacao, valor, 
        to_char(data_transacao, 'YYYY-MM-DD') as data_transacao FROM transacao 
        WHERE id_transacao = $1`, [id_transacao]);

        if(results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_transacao}`;
        } else {
            const transacao = results.rows[0];
            return new Transacao(transacao.id_transacao, transacao.especificacao, transacao.valor, transacao.data_transacao);
        }
    } catch (err) {
        throw "Erro ao recuperar a transação: " + err;
    }
}

module.exports = {
    getTransacoesDB, 
    addTransacaoDB, 
    updateTransacaoDB, 
    deleteTransacaoDB,
    getTransacaoPorCodigoDB
}