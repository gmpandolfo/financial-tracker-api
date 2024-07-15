INSERT INTO categoria (condicao, tipo) VALUES ('F', 'R');
INSERT INTO categoria (condicao, tipo) VALUES ('V', 'R');
INSERT INTO categoria (condicao, tipo) VALUES ('F', 'D');
INSERT INTO categoria (condicao, tipo) VALUES ('V', 'D');

INSERT INTO transacao (valor, data_transacao, especificacao, id_categoria) VALUES
(5000.00, '2024-07-01', 'Salário de Julho', 1), -- Receita Fixa
(200.00, '2024-07-10', 'Freelancer Projeto X', 2), -- Receita Variável
(1000.00, '2024-07-05', 'Aluguel de Julho', 3), -- Despesa Fixa
(300.00, '2024-07-08', 'Supermercado', 4); -- Despesa Variável