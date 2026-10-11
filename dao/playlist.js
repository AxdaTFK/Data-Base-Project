const db = require('../services/mysql.services');

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
    await db.query('DELETE FROM tracklist WHERE playlist_idplaylist = ?', [req.params.id]);
    const [result] = await db.query('DELETE FROM playlist WHERE idplaylist = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getSongs = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT s.* FROM tracklist t JOIN song s ON s.idsong = t.song_idsong WHERE t.playlist_idplaylist = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const addSong = async (req, res) => {
  try {
    const { song_idsong } = req.body;
    if (!song_idsong) return res.status(400).json({ error: 'Bad Request' });
    await db.query(
      'INSERT INTO tracklist (playlist_idplaylist, song_idsong) VALUES (?, ?)',
      [req.params.id, song_idsong]
    );
    res.status(201).json({ idplaylist: Number(req.params.id), song_idsong });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const removeSong = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM tracklist WHERE playlist_idplaylist = ? AND song_idsong = ?',
      [req.params.id, req.params.songId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'La canción no está en la playlist' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, getByUser, create, update, remove, getSongs, addSong, removeSong };