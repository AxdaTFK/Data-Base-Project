const db = require('../services/mysql.services');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM review');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM review WHERE idreview = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getBySong = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM review WHERE song_idsong = ?', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const create = async (req, res) => {
  try {
    const { tag = null, comment = null, qualification, metrics = null, song_idsong, user_iduser } = req.body;
    if (!qualification || !song_idsong || !user_iduser) return res.status(400).json({ error: 'Bad Request' });
    const [result] = await db.query(
      'INSERT INTO review (tag, comment, qualification, metrics, song_idsong, user_iduser) VALUES (?, ?, ?, ?, ?, ?)',
      [tag, comment, qualification, metrics, song_idsong, user_iduser]
    );
    res.status(201).json({ idreview: result.insertId, tag, comment, qualification, metrics, song_idsong, user_iduser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const { tag = null, comment = null, qualification, metrics = null, song_idsong, user_iduser } = req.body;
    if (!qualification || !song_idsong || !user_iduser) return res.status(400).json({ error: 'Bad Request' });
    const [result] = await db.query(
      'UPDATE review SET tag = ?, comment = ?, qualification = ?, metrics = ?, song_idsong = ?, user_iduser = ? WHERE idreview = ?',
      [tag, comment, qualification, metrics, song_idsong, user_iduser, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ idreview: Number(req.params.id), tag, comment, qualification, metrics, song_idsong, user_iduser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM review WHERE idreview = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, getBySong, create, update, remove };