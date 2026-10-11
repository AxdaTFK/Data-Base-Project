const db = require('../services/mysql.services');

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

const removeByPlaylist = async (idplaylist) => {
  await db.query('DELETE FROM tracklist WHERE playlist_idplaylist = ?', [idplaylist]);
};

module.exports = { getSongs, addSong, removeSong, removeByPlaylist };