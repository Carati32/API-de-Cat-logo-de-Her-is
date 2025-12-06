const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;


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


app.get('/heroes/buscar', async (req, res) => {
    try {
            console.log("Query recebida:", req.query);

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

app.post('/heroes', async (req, res) => {
    try {
        const { nome, poder, fraqueza, ranking, universo, ativo } = req.body;

        const [result] = await db.query(
            `INSERT INTO heroes (nome, poder, fraqueza, ranking, universo, ativo)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, poder, fraqueza, ranking, universo, ativo ?? 1]
        );

       res.status(201).json({
            id: result.insertId,
            nome,
            poder,
            fraqueza,
            ranking,
            universo,
            ativo: ativo ?? 1
        });   
     } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.put('/heroes/:id', async (req, res) => {
    try {
        const { nome, poder, fraqueza, ranking, universo, ativo } = req.body;
        const { id } = req.params;
        const [result] = await db.query(
            `UPDATE heroes
             SET nome=?, poder=?, fraqueza=?, ranking=?, universo=?, ativo=?
             WHERE id=?`,
            [nome, poder, fraqueza, ranking, universo, ativo, id]
        );

        res.json({
            mensagem: "Herói atualizado com sucesso!",
            id,
            nome,
            poder,
            fraqueza,
            ranking,
            universo,
            ativo: ativo ?? 1
        });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


app.delete('/heroes/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM heroes WHERE id=?", [req.params.id]);
        res.json({ mensagem: "Herói removido" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.put('/heroes/:id/ativar', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM heroes WHERE id=?", [id]);
        const heroi = rows[0];

        if (!heroi) {
            return res.status(404).json({ erro: "Herói não encontrado." });
        }

        if (heroi.ativo === 1) {
            return res.json({
                mensagem: "Herói já estava ativo.",
                heroi
            });
        }

        await db.query("UPDATE heroes SET ativo=1 WHERE id=?", [id]);

        const [dadosAtualizados] = await db.query("SELECT * FROM heroes WHERE id=?", [id]);

        res.json({
            mensagem: "Herói ativado com sucesso!",
            heroi: dadosAtualizados[0]
        });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.put('/heroes/:id/desativar', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM heroes WHERE id=?", [id]);
        const heroi = rows[0];

        if (!heroi) {
            return res.status(404).json({ erro: "Herói não encontrado." });
        }

        if (heroi.ativo === 0) {
            return res.json({
                mensagem: "Herói já estava desativado.",
                heroi
            });
        }

        await db.query("UPDATE heroes SET ativo=0 WHERE id=?", [id]);
        const [dadosAtualizados] = await db.query("SELECT * FROM heroes WHERE id=?", [id]);

        res.json({
            mensagem: "Herói desativado com sucesso!",
            heroi: dadosAtualizados[0]
        });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


app.post('/missions', async (req, res) => {
    try {
        const { id_heroi, titulo, descricao, sucesso } = req.body;

        const [heroRows] = await db.query(
            "SELECT * FROM heroes WHERE id = ?",
            [id_heroi]
        );

        if (heroRows.length === 0) {
            return res.status(404).json({ erro: "Herói não encontrado." });
        }

        const [result] = await db.query(
            `INSERT INTO missions (id_heroi, titulo, descricao, sucesso)
             VALUES (?, ?, ?, ?)`,
            [id_heroi, titulo, descricao, sucesso ?? 0]
        );

        res.status(201).json({
            id: result.insertId,
            id_heroi,
            titulo,
            descricao,
            sucesso: sucesso ?? 0,
        });

    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


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

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});
