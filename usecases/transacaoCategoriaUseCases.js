const { pool } = require('../config');
const TransacaoCategoria = require('../entities/TransacaoCategoria');

const getTransacaoCategoriasDB = async () => {
    try {
        const { rows } = await pool.query(`SELECT * FROM transacao_categoria ORDER BY id_transacao, id_categoria`);
        return rows.map((transacaoCategoria) => new TransacaoCategoria(transacaoCategoria));
    } catch (err) {
        throw "Erro: " + err;
    }
}

// const getTransacoesPorCategoriaDB = async (id_categoria) => {
//     try {
//         const { rows } = await pool.query(`SELECT t.id_transacao, t.valor, t.data_transacao, t.especificacao, t.condicao, t.tipo FROM transacao t JOIN transacao_categoria tc ON t.id_transacao = tc.id_transacao WHERE tc.id_categoria = $1`,
//             [id_categoria]);
//         return rows;
//     } catch (err) {
//         throw "Erro ao recuperar transações por categoria: " + err;
//     }
// }

// const getCategoriasPorTransacaoDB = async (id_transacao) => {
//     try {
//         const { rows } = await pool.query(`SELECT c.id_categoria, c.nome FROM categoria c JOIN transacao_categoria tc ON c.id_categoria = tc.id_categoria WHERE tc.id_transacao = $1`,
//             [id_transacao]);
//         return rows;
//     } catch (err) {
//         throw "Erro ao recuperar categorias por transação: " + err;
//     }
// }

const addTransacaoCategoriaDB = async (body) => {
    try {
        const { id_transacao, id_categoria } = body;
        const results = await pool.query(`INSERT INTO transacao_categoria (id_transacao, id_categoria) VALUES ($1, $2) RETURNING id_transacao, id_categoria`,
            [id_transacao, id_categoria]);
        const transacaoCategoria = results.rows[0];
        return new TransacaoCategoria(transacaoCategoria.id_transacao, transacaoCategoria.id_categoria);
    } catch (err) {
        throw "Erro ao inserir a transação-categoria: " + err;
    }
}

const updateTransacaoCategoriaDB = async (body) => {
    try {
        const { id_transacao, id_categoria } = body;
        const results = await pool.query(`UPDATE transacao_categoria SET id_transacao = $1, id_categoria = $2 WHERE id_transacao = $1 AND id_categoria = $2 RETURNING id_transacao, id_categoria`,
        [id_transacao, id_categoria]);

        if (results.rowCount == 0) {
            throw `Nenhuma associação encontrada entre a transação ${id_transacao} e a categoria ${id_categoria} para ser alterada`;
        }
        const transacaoCategoria = results.rows[0];
        return new TransacaoCategoria(transacaoCategoria.id_transacao, transacaoCategoria.id_categoria);
    }
    catch (err) {
        throw "Erro ao alterar a transação-categoria: " + err;
    }  
}


const deleteTransacaoCategoriaDB = async (id_transacao, id_categoria) => {
    try {
        const results = await pool.query(`DELETE FROM transacao_categoria WHERE id_transacao = $1 AND id_categoria = $2`,
            [id_transacao, id_categoria]);
        if (results.rowCount == 0) {
            throw `Nenhuma associação encontrada entre a transação ${id_transacao} e a categoria ${id_categoria}`;
        } else {
            return `Associação entre transação ${id_transacao} e categoria ${id_categoria} removida com sucesso!`;
        }
    } catch (err) {
        throw "Erro ao remover a transação-categoria: " + err;
    }
}

module.exports = {
    getTransacaoCategoriasDB,
    // getTransacoesPorCategoriaDB,
    // getCategoriasPorTransacaoDB, 
    addTransacaoCategoriaDB, 
    updateTransacaoCategoriaDB,
    deleteTransacaoCategoriaDB,
}