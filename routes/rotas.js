const { Router } = require('express');

const { rotasCategorias } = require('./rotasCategorias');
const { rotasTransacoes } = require('./rotasTransacoes');
const { rotasTransacaoCategoria } = require('./rotasTransacaoCategoria');

const rotas = new Router();

rotas.use(rotasCategorias);
rotas.use(rotasTransacoes);
rotas.use(rotasTransacaoCategoria);

module.exports = rotas;