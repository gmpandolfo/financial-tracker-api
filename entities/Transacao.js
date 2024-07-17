class Transacao {
    constructor(id_transacao, especificacao, valor,
        data_transacao, categorias = []) {
        this.id_transacao = id_transacao;
        this.especificacao = especificacao;
        this.valor = valor;
        this.data_transacao = data_transacao;
        this.categorias = categorias;
    }
}

module.exports = Transacao;