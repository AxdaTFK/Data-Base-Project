const db = require('../services/mysql.services');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT idartist, name FROM artist');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT idartist, name FROM artist WHERE idartist = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const [result] = await db.query('INSERT INTO artist (name) VALUES (?)', [name]);
    res.status(201).json({ idartist: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const [result] = await db.query('UPDATE artist SET name = ? WHERE idartist = ?', [name, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ idartist: Number(req.params.id), name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM artist WHERE idartist = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };