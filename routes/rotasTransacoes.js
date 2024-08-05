const { Router } = require('express');
const { getTransacoes, addTransacao, updateTransacao,
     deleteTransacao, getTransacaoPorCodigo } = 
    require('../controllers/transacaoController');
const { verificaJWT } = require('../controllers/segurancaController');

const rotasTransacoes = new Router();

rotasTransacoes.route('/transacao')
               .get(verificaJWT, getTransacoes)
               .post(verificaJWT, addTransacao)
               .put(verificaJWT, updateTransacao);

rotasTransacoes.route('/transacao/:codigo') 
               .get(verificaJWT, getTransacaoPorCodigo)              
               .delete(verificaJWT, deleteTransacao);

module.exports = { rotasTransacoes };