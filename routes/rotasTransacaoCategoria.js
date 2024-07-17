const { Router } = require('express');
const { getTransacaoCategorias, 
    // getCategoriasPorTransacao, 
    // getTransacoesPorCategoria, 
    addTransacaoCategoria, 
    updateTransacaoCategoria,
    deleteTransacaoCategoria } = require('../controllers/transacaoCategoriaController');

const rotasTransacaoCategoria = new Router();


rotasTransacaoCategoria.route('/transacao-categoria')
                        .get(getTransacaoCategorias)
                        // .get(getCategoriasPorTransacao)
                        // .get(getTransacoesPorCategoria)
                        .post(addTransacaoCategoria)
                        .put(updateTransacaoCategoria)
                        .delete(deleteTransacaoCategoria);
                        // adicionar put / update

module.exports = { rotasTransacaoCategoria };