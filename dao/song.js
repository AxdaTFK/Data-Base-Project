const db = require('../services/mysql.services');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM song');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM song WHERE id = ?',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, artist, genre, duration } = req.body;
    if (!title || !artist || !genre || !duration) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const [result] = await db.query(
      'INSERT INTO song (title, artist, genre, duration) VALUES (?, ?, ?, ?)',
      [title, artist, genre, duration]
    );
    res.status(201).json({ id: result.insertId, title, artist, genre, duration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create };