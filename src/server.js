// ==============================
// API Heróis Completa (server.js)
// ==============================

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET = "123";

app.use(express.json());
app.use(cors());

// ==============================
// BANCO DE DADOS (SEM .env)
// ==============================
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "heroisdb"
});

// ==============================
// ROTAS DE HERÓIS
// ==============================

// LISTAR (com paginação)
app.get('/herois', async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);
        const offset = (page - 1) * limit;

        const [dados] = await db.query("SELECT * FROM herois LIMIT ? OFFSET ?", [limit, offset]);
        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// LISTAR POR ID
app.get('/herois/:id', async (req, res) => {
    try {
        const [heroi] = await db.query("SELECT * FROM herois WHERE id = ?", [req.params.id]);
        if (heroi.length === 0) return res.status(404).json({ mensagem: "Herói não encontrado" });
        res.json(heroi[0]);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// BUSCAR POR NOME (rota especial)
app.get('/herois/buscar', async (req, res) => {
    try {
        const nome = `%${req.query.nome || ''}%`;
        const [dados] = await db.query("SELECT * FROM herois WHERE nome LIKE ?", [nome]);
        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// RANKING TOP 10
app.get('/herois/ranking/top10', async (req, res) => {
    try {
        const [dados] = await db.query("SELECT * FROM herois ORDER BY poder DESC LIMIT 10");
        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// CRIAR HERÓI
app.post('/herois', async (req, res) => {
    try {
        const { nome, poder, ativo } = req.body;
        const [result] = await db.query(
            "INSERT INTO herois (nome, poder, ativo) VALUES (?, ?, ?)",
            [nome, poder, ativo ?? 1]
        );
        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ATUALIZAR HERÓI
app.put('/herois/:id', async (req, res) => {
    try {
        const { nome, poder, ativo } = req.body;
        await db.query(
            "UPDATE herois SET nome=?, poder=?, ativo=? WHERE id=?",
            [nome, poder, ativo, req.params.id]
        );
        res.json({ mensagem: "Herói atualizado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// DELETAR
app.delete('/herois/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM herois WHERE id=?", [req.params.id]);
        res.json({ mensagem: "Herói removido" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ATIVAR
app.put('/herois/:id/ativar', async (req, res) => {
    try {
        await db.query("UPDATE herois SET ativo=1 WHERE id=?", [req.params.id]);
        res.json({ mensagem: "Herói ativado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// DESATIVAR
app.put('/herois/:id/desativar', async (req, res) => {
    try {
        await db.query("UPDATE herois SET ativo=0 WHERE id=?", [req.params.id]);
        res.json({ mensagem: "Herói desativado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ==============================
// MISSÕES
// ==============================

// CRIAR MISSÃO
app.post('/missoes', async (req, res) => {
    try {
        const { titulo, dificuldade, heroi_id } = req.body;
        const [result] = await db.query(
            "INSERT INTO missoes (titulo, dificuldade, heroi_id) VALUES (?, ?, ?)",
            [titulo, dificuldade, heroi_id]
        );
        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// LISTAR MISSÕES DE UM HERÓI
app.get('/herois/:id/missoes', async (req, res) => {
    try {
        const [dados] = await db.query("SELECT * FROM missoes WHERE heroi_id=?", [req.params.id]);
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