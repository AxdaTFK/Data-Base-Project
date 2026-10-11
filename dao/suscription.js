const db = require('../services/mysql.services');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM subscription');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM subscription WHERE id = ?',
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
    const { user_id, plan, start_date } = req.body;
    if (!user_id || !plan || !start_date) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const [result] = await db.query(
      'INSERT INTO subscription (user_id, plan, start_date) VALUES (?, ?, ?)',
      [user_id, plan, start_date]
    );
    res.status(201).json({ id: result.insertId, user_id, plan, start_date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create };