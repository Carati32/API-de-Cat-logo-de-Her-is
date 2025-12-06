
  CREATE DATABASE IF NOT EXISTS catalogo_herois;
  USE catalogo_herois;

  CREATE TABLE IF NOT EXISTS heroes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    poder VARCHAR(120),
    fraqueza VARCHAR(120),
    ranking INT NOT NULL,
    universo ENUM('Marvel','DC','Outro') NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

SELECT * FROM heroes;
  CREATE TABLE IF NOT EXISTS missions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_heroi INT NOT NULL,
    titulo VARCHAR(100),
    descricao TEXT,
    sucesso BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_heroi) REFERENCES heroes(id) ON DELETE CASCADE
  );

  -- Exemplos de inserts:
  INSERT INTO heroes (nome, poder, fraqueza, ranking, universo) VALUES
    ('Aço Veloz','Velocidade sobre-humana','Frio extremo',85,'Outro'),
    ('Luziana','Manipulação de luz','Escuridão total',78,'Marvel'),
    ('Sombra','Intangibilidade','Luz intensa',64,'DC'),
    ('Titã','Força sobre-humana','Velocidade baixa',90,'Outro'),
    ('Maga','Feitiços','Ceticismo científico',72,'Marvel');

  INSERT INTO missions (id_heroi, titulo, descricao, sucesso) VALUES
    (1,'Salvar trem','Evitar colisão de trem suburbano',TRUE),
    (2,'Resgate lunar','Resgatar equipe na lua',FALSE);
