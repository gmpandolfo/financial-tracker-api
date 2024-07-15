const { pool } = require('../config');
const Categoria = require('../entities/Categoria');

// Função para atribuir nome automaticamente com base em condicao e tipo
const atribuirNomeCategoria = (condicao, tipo) => {
    if (tipo === 'R' && condicao === 'F') {
        return 'Receita Fixa';
    } else if (tipo === 'R' && condicao === 'V') {
        return 'Receita Variável';
    } else if (tipo === 'D' && condicao === 'F') {
        return 'Despesa Fixa';
    } else if (tipo === 'D' && condicao === 'V') {
        return 'Despesa Variável';
    }
    return null;
}

const getCategoriasDB = async () => {
    try {
        const { rows } = await pool.query(`SELECT * FROM categoria ORDER BY nome`);
        return rows.map((categoria) => new Categoria(categoria.id_categoria, categoria.nome, categoria.condicao, categoria.tipo));
    } catch (err) {
        throw "Erro: " + err;
    }
}

const addCategoriaDB = async (body) => {
    try {
        const { condicao, tipo } = body;
        const nome = atribuirNomeCategoria(condicao, tipo);
        const results = await pool.query(`INSERT INTO categoria (nome, condicao, tipo) VALUES ($1, $2, $3)
        RETURNING id_categoria, nome, condicao, tipo`, [nome, condicao, tipo]);
        const categoria = results.rows[0];
        return new Categoria(categoria.id_categoria, categoria.nome, categoria.condicao, categoria.tipo);
    } catch (err) {
        throw "Erro ao inserir a categoria: " + err;
    }
}

const updateCategoriaDB = async (body) => {
    try {
        const { id_categoria, condicao, tipo } = body;
        const nome = atribuirNomeCategoria(condicao, tipo);
        const results = await pool.query(`UPDATE categoria SET nome = $2, condicao = $3, tipo = $4
        WHERE id_categoria = $1 RETURNING id_categoria, nome, condicao, tipo`, [id_categoria, nome, condicao, tipo]);
        if (results.rowCount == 0) {
            throw `Nenhum registro encontrado com o código ${id_categoria} para ser alterado`;
        }
        const categoria = results.rows[0];
        return new Categoria(categoria.id_categoria, categoria.nome, categoria.condicao, categoria.tipo);
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
            return new Categoria(categoria.id_categoria, categoria.nome, categoria.condicao, categoria.tipo);
        }
    } catch (err) {
        throw "Erro ao recuperar a categoria: " + err;
    }
}

module.exports = {
    getCategoriasDB, addCategoriaDB, updateCategoriaDB, deleteCategoriaDB, getCategoriaPorCodigoDB
}