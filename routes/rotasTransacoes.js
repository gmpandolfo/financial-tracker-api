const { Router } = require('express');
const { getTransacoes, addTransacao, updateTransacao,
     deleteTransacao, getTransacaoPorCodigo } = 
    require('../controllers/transacaoController');

const rotasTransacoes = new Router();

rotasTransacoes.route('/transacao')
               .get(getTransacoes)
               .post(addTransacao)
               .put(updateTransacao);

rotasTransacoes.route('/transacao/:codigo') 
               .get(getTransacaoPorCodigo)              
               .delete(deleteTransacao);

module.exports = { rotasTransacoes };