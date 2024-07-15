class Transacao {
    constructor(id_transacao, especificacao, valor, 
        data_transacao, categoria, categoria_nome
    ){
        this.id_transacao = id_transacao;
        this.especificacao = especificacao;
        this.valor = valor;
        this.data_transacao = data_transacao;
        this.categoria = categoria;
        this.categoria_nome = categoria_nome;
    }
}

module.exports = Transacao;