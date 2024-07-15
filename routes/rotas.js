const { Router } = require('express');

const { rotasCategorias } = require('./rotasCategorias');
const { rotasTransacoes } = require('./rotasTransacoes');

const rotas = new Router();

rotas.use(rotasCategorias);
rotas.use(rotasTransacoes);

module.exports = rotas;