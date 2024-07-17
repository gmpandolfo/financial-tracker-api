const { pool } = require('../config');
const Transacao = require('../entities/Transacao');

const getTransacoesDB = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT t.id_transacao, t.especificacao, t.valor, 
                   to_char(t.data_transacao, 'YYYY-MM-DD') as data_transacao, 
                   ARRAY_AGG(c.nome) as categorias
            FROM transacao t
            LEFT JOIN transacao_categoria tc ON t.id_transacao = tc.id_transacao
            LEFT JOIN categoria c ON tc.id_categoria = c.id_categoria
            GROUP BY t.id_transacao
            ORDER BY t.data_transacao DESC
        `);

        return rows.map(transacao => 
            new Transacao(transacao.id_transacao, transacao.especificacao, transacao.valor, transacao.data_transacao, transacao.categorias)
        );
    } catch (err) {
        throw new Error("Erro ao buscar transações: " + err);
    }
}

const addTransacaoDB = async (body) => {
    const { especificacao, valor, data_transacao, categorias } = body;
    // constole.log('to aqui');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const transacaoResult = await client.query(`
            INSERT INTO transacao (especificacao, valor, data_transacao) 
            VALUES ($1, $2, $3) 
            RETURNING id_transacao, especificacao, valor, to_char(data_transacao, 'YYYY-MM-DD') as data_transacao
        `, [especificacao, valor, data_transacao]);
        
        const transacao = transacaoResult.rows[0];
        
        // Converter nomes de categorias em IDs
        const categoriaIDs = await Promise.all(
            categorias.map(async (nomeCategoria) => {
                const categoriaResult = await client.query(`
                    SELECT id_categoria FROM categoria WHERE nome = $1
                `, [nomeCategoria]);
                if (categoriaResult.rows.length > 0) {
                    return categoriaResult.rows[0].id_categoria;
                } else {
                    throw new Error(`Categoria ${nomeCategoria} não encontrada.`);
                }
            })
        );

        for (let id_categoria of categoriaIDs) {
            await client.query(`
                INSERT INTO transacao_categoria (id_transacao, id_categoria) 
                VALUES ($1, $2)
            `, [transacao.id_transacao, id_categoria]);
        }

        await client.query('COMMIT');

        return new Transacao(transacao.id_transacao, transacao.especificacao, transacao.valor, transacao.data_transacao, categorias);
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error("Erro ao inserir a transação: " + err);
    } finally {
        client.release();
    }
}

const updateTransacaoDB = async (body) => {
    const { id_transacao, especificacao, valor, data_transacao, categorias } = body;

    // console.log(body);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const transacaoResult = await client.query(`
            UPDATE transacao 
            SET especificacao = $2, valor = $3, data_transacao = $4
            WHERE id_transacao = $1 
            RETURNING id_transacao, especificacao, valor, to_char(data_transacao, 'YYYY-MM-DD') as data_transacao
        `, [id_transacao, especificacao, valor, data_transacao]);

        if (transacaoResult.rowCount === 0) {
            throw `Nenhum registro encontrado com o código ${id_transacao} para ser alterado`;
        }

        await client.query(`DELETE FROM transacao_categoria WHERE id_transacao = $1`, [id_transacao]);

        // Converter nomes de categorias em IDs
        const categoriaIDs = await Promise.all(
            categorias.map(async (nomeCategoria) => {
                const categoriaResult = await client.query(`
                    SELECT id_categoria FROM categoria WHERE nome = $1
                `, [nomeCategoria]);
                if (categoriaResult.rows.length > 0) {
                    return categoriaResult.rows[0].id_categoria;
                } else {
                    throw new Error(`Categoria ${nomeCategoria} não encontrada.`);
                }
            })
        );

        for (let id_categoria of categoriaIDs) {
            await client.query(`
                INSERT INTO transacao_categoria (id_transacao, id_categoria) 
                VALUES ($1, $2)
            `, [id_transacao, id_categoria]);
        }

        await client.query('COMMIT');

        return new Transacao(id_transacao, especificacao, valor, data_transacao, categorias);
    } catch (err) {
        await client.query('ROLLBACK');
        throw new Error("Erro ao alterar a transação: " + err);
    } finally {
        client.release();
    }
}

const deleteTransacaoDB = async (id_transacao) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(`DELETE FROM transacao_categoria WHERE id_transacao = $1`, [id_transacao]);
        const transacaoResult = await client.query(`DELETE FROM transacao WHERE id_transacao = $1 RETURNING id_transacao`, [id_transacao]);

        await client.query('COMMIT');
        if (transacaoResult.rowCount === 0) {
            throw `Nenhum registro encontrado com o código ${id_transacao} para ser removido`;
        }

        return `Transação de código ${id_transacao} removida com sucesso!`;
    } catch (err) {
        await client.query('ROLLBACK');
        throw "Erro ao remover a transação: " + err;
    } finally {
        client.release();
    }
}
const getTransacaoPorCodigoDB = async (id_transacao) => {
    try {
        const { rows } = await pool.query(`
        SELECT t.id_transacao as id_transacao, t.valor as valor, 
        to_char(t.data_transacao, 'YYYY-MM-DD') as data_transacao, 
        t.especificacao as especificacao,
        ARRAY_AGG(c.nome) as categorias
        FROM transacao t
        LEFT JOIN transacao_categoria tc ON t.id_transacao = tc.id_transacao
        LEFT JOIN categoria c ON tc.id_categoria = c.id_categoria
        WHERE t.id_transacao = $1
        GROUP BY t.id_transacao`, [id_transacao]);
        if (rows.length == 0) {
            throw `Nenhum registro encontrado com o código ${id_transacao}`;
        } else {
            const transacao = rows[0];
            return new Transacao(transacao.id_transacao, transacao.especificacao, transacao.valor, transacao.data_transacao, transacao.categorias);
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