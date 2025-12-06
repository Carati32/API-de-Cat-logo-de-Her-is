# 📘 API – Catálogo de Heróis

Sistema REST para gerenciamento de **heróis**, **ranking**, **ativação/desativação** e **missões** relacionadas.

---

## 🚀 Tecnologias Utilizadas

* Node.js
* Express
* MySQL (mysql2/promise)
* CORS
* Sem dotenv (configuração direta no server.js)

---

## 🗂️ Estrutura do Projeto

```
/server.js
/README.md
```

---

## 🛠️ Instalação

### 1. Instalar dependências

```bash
npm install express mysql2 cors
```

### 2. Iniciar o servidor

```bash
node server.js
```

Servidor rodará em:

```
http://localhost:3000
```

---

## 🏛️ Banco de Dados (MySQL)

### Criar Base + Tabelas

```sql
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

CREATE TABLE IF NOT EXISTS missions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_heroi INT NOT NULL,
  titulo VARCHAR(100),
  descricao TEXT,
  sucesso BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_heroi) REFERENCES heroes(id) ON DELETE CASCADE
);
```

---

## 🧩 Entidades

### 🦸 Tabela **heroes**

| Campo    | Tipo    | Descrição            |
| -------- | ------- | -------------------- |
| id       | INT PK  | Identificador único  |
| nome     | VARCHAR | Nome do herói        |
| poder    | VARCHAR | Habilidade           |
| fraqueza | VARCHAR | Fraqueza             |
| ranking  | INT     | Nível 1–100          |
| universo | ENUM    | Marvel, DC, Outro    |
| ativo    | BOOLEAN | Indica se está ativo |

### 🎯 Tabela **missions**

| Campo     | Tipo    | Descrição         |
| --------- | ------- | ----------------- |
| id        | INT PK  | ID da missão      |
| id_heroi  | INT FK  | Herói responsável |
| titulo    | VARCHAR | Nome da missão    |
| descricao | TEXT    | Detalhes          |
| sucesso   | BOOLEAN | Concluída?        |

---

## 📊 Diagrama ER

```
┌───────────┐        1    N        ┌──────────────┐
│  HEROES   │──────────────────────▶│  MISSIONS    │
├───────────┤                       ├──────────────┤
│ id        │                       │ id           │
│ nome      │                       │ id_heroi     │
│ poder     │                       │ titulo       │
│ fraqueza  │                       │ descricao    │
│ ranking   │                       │ sucesso      │
│ universo  │                       └──────────────┘
│ ativo     │
└───────────┘
```

---

## 🌐 Endpoints

### 🦸 **Heróis**

**GET /heroes** – Lista todos os heróis
**GET /heroes/:id** – Busca por ID
**POST /heroes** – Cria herói
**PUT /heroes/:id** – Atualiza herói
**DELETE /heroes/:id** – Soft delete (ativo = false)

---

## ⭐ Rotas Especiais

**GET /heroes/ranking/top10** – Top 10 por ranking
**GET /heroes/buscar?nome=bat** – Busca parcial por nome
**PUT /heroes/:id/ativar** – Ativa herói
**PUT /heroes/:id/desativar** – Desativa herói

---

## 🎯 Missões

**POST /heroes/:id/missions** – Criar missão
**GET /heroes/:id/missions** – Listar missões de um herói
**GET /missions/:id** – Buscar missão
**PUT /missions/:id** – Atualizar missão
**DELETE /missions/:id** – Deletar missão

---

## 📑 Paginação

**GET /heroes?page=1&limit=10**

---

## ✔️ Status do Projeto

* Código funcional
* Documentação
