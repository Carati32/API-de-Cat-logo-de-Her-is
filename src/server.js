
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

// ==============================
// BANCO DE DADOS (SEM .env)
// ==============================
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "senai",
    database: "catalogo_herois"
});

app.get('/heroes', async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);
        const offset = (page - 1) * limit;

        const [dados] = await db.query(
            "SELECT * FROM heroes LIMIT ? OFFSET ?",
            [limit, offset]
        );

        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.get('/heroes/:id', async (req, res) => {
    try {
        const [heroi] = await db.query(
            "SELECT * FROM heroes WHERE id = ?",
            [req.params.id]
        );

        if (heroi.length === 0)
            return res.status(404).json({ mensagem: "Herói não encontrado" });

        res.json(heroi[0]);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// BUSCAR POR NOME
app.get('/heroes/buscar', async (req, res) => {
    try {
        const { nome } = req.query;

        if (!nome || nome.trim() === "") {
            return res.status(400).json({
                erro: "Você deve enviar o parâmetro ?nome= para realizar a busca."
            });
        }

        const busca = `%${nome}%`;

        const [dados] = await db.query(
            "SELECT * FROM heroes WHERE nome LIKE ?",
            [busca]
        );

        res.json(dados);

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


// RANKING TOP 10
app.get('/heroes/ranking/top10', async (req, res) => {
    try {
        const [dados] = await db.query(
            "SELECT * FROM heroes ORDER BY ranking DESC LIMIT 10"
        );
        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// CRIAR HERÓI
app.post('/heroes', async (req, res) => {
    try {
        const { nome, poder, fraqueza, ranking, universo, ativo } = req.body;

        const [result] = await db.query(
            `INSERT INTO heroes (nome, poder, fraqueza, ranking, universo, ativo)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, poder, fraqueza, ranking, universo, ativo ?? 1]
        );

        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ATUALIZAR HERÓI
app.put('/heroes/:id', async (req, res) => {
    try {
        const { nome, poder, fraqueza, ranking, universo, ativo } = req.body;

        await db.query(
            `UPDATE heroes
             SET nome=?, poder=?, fraqueza=?, ranking=?, universo=?, ativo=?
             WHERE id=?`,
            [nome, poder, fraqueza, ranking, universo, ativo, req.params.id]
        );

        res.json({ mensagem: "Herói atualizado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// DELETAR HERÓI
app.delete('/heroes/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM heroes WHERE id=?", [req.params.id]);
        res.json({ mensagem: "Herói removido" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ATIVAR
app.put('/heroes/:id/ativar', async (req, res) => {
    try {
        await db.query("UPDATE heroes SET ativo=1 WHERE id=?", [req.params.id]);
        res.json({ mensagem: "Herói ativado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// DESATIVAR
app.put('/heroes/:id/desativar', async (req, res) => {
    try {
        await db.query("UPDATE heroes SET ativo=0 WHERE id=?", [req.params.id]);
        res.json({ mensagem: "Herói desativado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==============================
// MISSÕES
// ==============================

// CRIAR MISSÃO
app.post('/missions', async (req, res) => {
    try {
        const { id_heroi, titulo, descricao, sucesso } = req.body;

        const [result] = await db.query(
            `INSERT INTO missions (id_heroi, titulo, descricao, sucesso)
             VALUES (?, ?, ?, ?)`,
            [id_heroi, titulo, descricao, sucesso ?? 0]
        );

        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// LISTAR MISSÕES DE UM HERÓI
app.get('/heroes/:id/missions', async (req, res) => {
    try {
        const [dados] = await db.query(
            "SELECT * FROM missions WHERE id_heroi=?",
            [req.params.id]
        );
        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==============================
// INICIAR SERVIDOR
// ==============================
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});
