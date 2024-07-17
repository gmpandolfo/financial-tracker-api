const { getTransacoesDB, addTransacaoDB, updateTransacaoDB, 
      deleteTransacaoDB, getTransacaoPorCodigoDB } 
      = require('../usecases/transacaoUseCases');

const getTransacoes = async (request, response) => {
    await getTransacoesDB()
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : 'Erro ao consultar os Transacoes: ' + err
          }))
}

const addTransacao = async (request, response) => {
    await addTransacaoDB(request.body)
          .then(data => response.status(200).json({
                status : "success", message : "Transacao criado",
                objeto : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const updateTransacao = async (request, response) => {
    await updateTransacaoDB(request.body)
          .then(data => response.status(200).json({
                status : "success", message : "Transacao alterada",
                objeto : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const deleteTransacao = async (request, response) => {
    await deleteTransacaoDB(request.params.codigo)
          .then(data => response.status(200).json({
                status : "success", message : data
          }))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

const getTransacaoPorCodigo = async (request, response) => {
    await getTransacaoPorCodigoDB(request.params.codigo)
          .then(data => response.status(200).json(data))
          .catch(err => response.status(400).json({
            status : 'error',
            message : err
          }))
}

module.exports = {
      getTransacoes, addTransacao, updateTransacao, deleteTransacao, getTransacaoPorCodigo
}