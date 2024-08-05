const { Router } = require('express');

const { rotasCategorias } = require('./rotasCategorias');
const { rotasTransacoes } = require('./rotasTransacoes');
const { login } = require('../controllers/segurancaController');

const rotas = new Router();

rotas.route("/login").post(login);

rotas.use(rotasCategorias);
rotas.use(rotasTransacoes);

module.exports = rotas;