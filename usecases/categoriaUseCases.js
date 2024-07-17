const { pool } = require('../config');
const Categoria = require('../entities/Categoria');

const getCategoriasDB = async () => {
    try {
        const { rows } = await pool.query(`SELECT * FROM categoria ORDER BY nome`);
        return rows.map((categoria) => new Categoria(categoria.id_categoria, categoria.nome));
    } catch (err) {
        throw "Erro: " + err;
    }
}

const addCategoriaDB = async (body) => {
    try {
        const { nome } = body;
        const results = await pool.query(`INSERT INTO categoria (nome) VALUES ($1)
        RETURNING id_categoria, nome`, [nome]);
        const categoria = results.rows[0];
        return new Categoria(categoria.id_categoria, categoria.nome);
    } catch (err) {
        throw "Erro ao inserir a categoria: " + err;
    }
}

const updateCategoriaDB = async (body) => {
    try {
        const { id_categoria, nome } = body;
        const results = await pool.query(`UPDATE categoria SET nome = $2
        WHERE id_categoria = $1 RETURNING id_categoria, nome`, [id_categoria, nome]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_categoria} para ser alterado`;
        }
        const categoria = results.rows[0];
        return new Categoria(categoria.id_categoria, categoria.nome);
    } catch (err) {
        throw "Erro ao alterar a categoria: " + err;
    }
}

const deleteCategoriaDB = async (id_categoria) => {
    try {
        const results = await pool.query(`DELETE FROM categoria
        WHERE id_categoria = $1`, [id_categoria]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_categoria} para ser removido`;
        } else {
            return `Categoria de código ${id_categoria} removida com sucesso!`;
        }
    } catch (err) {
        throw "Erro ao remover a categoria: " + err;
    }
}

const getCategoriaPorCodigoDB = async (id_categoria) => {
    try {
        const results = await pool.query(`SELECT * FROM categoria
        WHERE id_categoria = $1`, [id_categoria]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_categoria}`;
        } else {
            const categoria = results.rows[0];
            return new Categoria(categoria.id_categoria, categoria.nome);
        }
    } catch (err) {
        throw "Erro ao recuperar a categoria: " + err;
    }
}

module.exports = {
    getCategoriasDB, addCategoriaDB, updateCategoriaDB, deleteCategoriaDB, getCategoriaPorCodigoDB
}