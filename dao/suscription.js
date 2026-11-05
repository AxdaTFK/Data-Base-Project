const db = require('../services/mysql.services');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suscription');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM suscription WHERE idsuscription = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const create = async (req, res) => {
  try {
    const { type, update_plan } = req.body;
    if (!type) return res.status(400).json({ error: 'Bad Request' });
    const [result] = await db.query('INSERT INTO suscription (type, update_plan) VALUES (?, COALESCE(?, CURDATE()))', [type, update_plan || null]);
    const [rows] = await db.query('SELECT * FROM suscription WHERE idsuscription = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const { type, update_plan } = req.body;
    if (!type) return res.status(400).json({ error: 'Bad Request' });
    const [result] = await db.query('UPDATE suscription SET type = ?, update_plan = COALESCE(?, CURDATE()) WHERE idsuscription = ?', [type, update_plan || null, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    const [rows] = await db.query('SELECT * FROM suscription WHERE idsuscription = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM suscription WHERE idsuscription = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };