const { getTransacaoCategoriasDB, 
    addTransacaoCategoriaDB, 
    updateTransacaoCategoriaDB, 
    deleteTransacaoCategoriaDB } = require('../usecases/transacaoCategoriaUseCases');

const getTransacaoCategorias = async (request, response) => {
    await getTransacaoCategoriasDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar as transação-categoria: ' + err
        }));
}

// const getTransacoesPorCategoria = async (request, response) => {
//     await getTransacoesPorCategoriaDB(request.params.id_categoria)
//         .then(data => response.status(200).json(data))
//         .catch(err => response.status(400).json({
//             status: 'error',
//             message: 'Erro ao consultar as transações por categoria: ' + err
//         }));
// }

// const getCategoriasPorTransacao = async (request, response) => { 
//     await getCategoriasPorTransacaoDB(request.params.id_transacao)
//         .then(data => response.status(200).json(data))
//         .catch(err => response.status(400).json({
//             status: 'error',
//             message: 'Erro ao consultar' + err 
//         }));
// }

const addTransacaoCategoria = async (request, response) => {
    await addTransacaoCategoriaDB(request.body)
        .then(data => response.status(200).json({
            status: "success", message: "Associação transação-categoria criada",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const updateTransacaoCategoria = async (request, response) => {
    await updateTransacaoCategoriaDB(request.body)
        .then(data => response.status(200).json({
            status: "success", message: "Associação transação-categoria alterada",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}


const deleteTransacaoCategoria = async (request, response) => {
    const { id_transacao, id_categoria } = request.params;
    await deleteTransacaoCategoriaDB(id_transacao, id_categoria)
        .then(data => response.status(200).json({
            status: "success", message: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

module.exports = {
    getTransacaoCategorias, 
    // getCategoriasPorTransacao, 
    // getTransacoesPorCategoria, 
    addTransacaoCategoria, 
    updateTransacaoCategoria,
    deleteTransacaoCategoria 
}