CREATE TABLE categoria 
(
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(20) NOT NULL
);

CREATE TABLE transacao 
(
    id_transacao SERIAL PRIMARY KEY,
    especificacao VARCHAR(50) NOT NULL, -- Detalhes específicos sobre a transação
    valor NUMERIC(10, 2) NOT NULL CHECK (valor >= 0),
    data_transacao DATE DEFAULT CURRENT_DATE 
);

CREATE TABLE transacao_categoria
(
    id_transacao INT REFERENCES transacao(id_transacao),
    id_categoria INT REFERENCES categoria(id_categoria),
    PRIMARY KEY (id_transacao, id_categoria)
);