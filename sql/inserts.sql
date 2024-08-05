-- Inserindo categorias
INSERT INTO categoria (nome) VALUES 
('Receita Fixa'),
('Freelancer'),
('Despesas Fixas'),
('Supermercado'),
('Receita Variável');

-- Inserindo transações
INSERT INTO transacao (valor, data_transacao, especificacao) VALUES
(5000.00, '2024-07-01', 'Salário de Julho'), 
(200.00, '2024-07-10', 'Freelancer Projeto X'), 
(1000.00, '2024-07-05', 'Aluguel de Julho'), 
(300.00, '2024-07-08', 'Supermercado'); 

-- Inserindo transações categorizadas
INSERT INTO transacao_categoria (id_transacao, id_categoria) VALUES
(1, 1), -- Salário - Receita Fixa
(2, 3), -- Freelancer Projeto X - Freelancer
(2, 5), -- Freelancer Projeto X - Receita Variável
(3, 2), -- Aluguel de Julho - Despesa Fixa
(4, 4), -- Supermercado - Supermercado 
(4, 2); -- Supermercado - Despesa Fixa

--
SELECT * FROM categoria;
SELECT * FROM transacao;
SELECT * FROM transacao_categoria;
SELECT * FROM usuarios;

-- TRUNCATE TABLE categoria, transacao, transacao_categoria;

-- inserindo alguns registros na tabela usuários
insert into usuarios (email, senha, tipo, telefone, nome) 
values ('jorgebavaresco@ifsul.edu.br', '123456', 'A','(54)99984-4348','Jorge Bavaresco'), 
('joao@ifsul.edu.br', '123456', 'U','(54)44484-4348','Joao');