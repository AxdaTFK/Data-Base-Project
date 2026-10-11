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
    const [rows] = await db.query('SELECT * FROM song WHERE idsong = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const create = async (req, res) => {
  try {
    const { name, duration } = req.body;
    if (!name || !duration) return res.status(400).json({ error: 'Bad Request' });
    const [result] = await db.query('INSERT INTO song (name, duration) VALUES (?, ?)', [name, duration]);
    res.status(201).json({ idsong: result.insertId, name, duration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const { name, duration } = req.body;
    if (!name || !duration) return res.status(400).json({ error: 'Bad Request' });
    const [result] = await db.query('UPDATE song SET name = ?, duration = ? WHERE idsong = ?', [name, duration, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ idsong: Number(req.params.id), name, duration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM song WHERE idsong = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };