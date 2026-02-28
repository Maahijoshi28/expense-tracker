const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

// Database Setup
const dbPath = path.join(__dirname, 'expenses.db');
const db = new sqlite3.Database(dbPath);

// Initialize Table
db.run("CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, amount REAL, category TEXT)");

// Route: Save (POST)
app.post('/add', (req, res) => {
    const { title, amount, category } = req.body;
    db.run("INSERT INTO expenses (title, amount, category) VALUES (?, ?, ?)", [title, amount, category], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, title, amount, category });
    });
});

// Route: Get List (GET)
app.get('/list', (req, res) => {
    db.all("SELECT * FROM expenses", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Route: Delete (DELETE)
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM expenses WHERE id = ?", id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted successfully" });
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));