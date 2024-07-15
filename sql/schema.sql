CREATE TABLE categoria 
(
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(20),
    condicao CHAR(1) NOT NULL CHECK (condicao IN ('F', 'V')), -- 'F' para fixo, 'V' para variável
    tipo CHAR(1) NOT NULL CHECK (tipo IN ('R', 'D')) -- 'R' para receita, 'D' para despesa
);

CREATE TABLE transacao 
(
    id_transacao SERIAL PRIMARY KEY,
    especificacao VARCHAR(50), -- Detalhes específicos sobre a transação
    valor NUMERIC(10, 2) NOT NULL CHECK (valor >= 0),
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- data e hora da última modificação
    id_categoria INT REFERENCES categoria(id_categoria)
);

CREATE INDEX idx_categoria_id ON transacao(id_categoria);


CREATE OR REPLACE FUNCTION atribuir_nome_categoria()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo = 'R' AND NEW.condicao = 'F' THEN
        NEW.nome := 'Receita Fixa';
    ELSIF NEW.tipo = 'R' AND NEW.condicao = 'V' THEN
        NEW.nome := 'Receita Variável';
    ELSIF NEW.tipo = 'D' AND NEW.condicao = 'F' THEN
        NEW.nome := 'Despesa Fixa';
    ELSIF NEW.tipo = 'D' AND NEW.condicao = 'V' THEN
        NEW.nome := 'Despesa Variável';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atribuir_nome_trigger
BEFORE INSERT ON categoria
FOR EACH ROW
EXECUTE FUNCTION atribuir_nome_categoria();
