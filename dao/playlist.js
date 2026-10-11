const db = require('../services/mysql.services');
const tracklistDao = require('./tracklist');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM playlist');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM playlist WHERE idplaylist = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getByUser = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM playlist WHERE user_iduser = ?', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const create = async (req, res) => {
  try {
    const { name, user_iduser } = req.body;
    if (!name || !user_iduser) return res.status(400).json({ error: 'Bad Request' });
    const [result] = await db.query('INSERT INTO playlist (name, user_iduser) VALUES (?, ?)', [name, user_iduser]);
    res.status(201).json({ idplaylist: result.insertId, name, user_iduser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const { name, user_iduser } = req.body;
    if (!name || !user_iduser) return res.status(400).json({ error: 'Bad Request' });
    const [result] = await db.query(
      'UPDATE playlist SET name = ?, user_iduser = ? WHERE idplaylist = ?',
      [name, user_iduser, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ idplaylist: Number(req.params.id), name, user_iduser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const remove = async (req, res) => {
  try {
    await tracklistDao.removeByPlaylist(req.params.id);
    const [result] = await db.query('DELETE FROM playlist WHERE idplaylist = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, getByUser, create, update, remove };