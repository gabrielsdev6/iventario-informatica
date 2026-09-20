CREATE TABLE IF NOT EXISTS equipamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade >= 0),
    categoria VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Disponível', 'Em uso', 'Em manutenção')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO equipamentos (nome, quantidade, categoria, status) VALUES
('Notebook Dell Inspiron 15', 5, 'Computador', 'Disponível'),
('Monitor LG UltraWide 29"', 8, 'Periférico', 'Em uso'),
('Roteador Cisco Dual Band', 2, 'Rede', 'Em manutenção'),
('Mouse Sem Fio Logitech MX', 15, 'Periférico', 'Disponível'),
('MacBook Air M2', 3, 'Computador', 'Em uso')
ON CONFLICT DO NOTHING;