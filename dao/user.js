const db = require('../services/mysql.services');
const bcrypt = require('bcrypt');

const getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT iduser, is_admin, name, email, suscription_idsuscription FROM user');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT iduser, is_admin, name, email, suscription_idsuscription FROM user WHERE iduser = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const create = async (req, res) => {
  try {
    const { name, email, password, suscription_idsuscription } = req.body;
    const is_admin = req.body.is_admin ? 1 : 0;
    if (!name || !email || !password || !suscription_idsuscription) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO user (is_admin, name, email, password_hash, suscription_idsuscription) VALUES (?, ?, ?, ?, ?)',
      [is_admin, name, email, password_hash, suscription_idsuscription]
    );
    res.status(201).json({ iduser: result.insertId, is_admin, name, email, suscription_idsuscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const update = async (req, res) => {
  try {
    const { name, email, password, suscription_idsuscription } = req.body;
    const is_admin = req.body.is_admin ? 1 : 0;
    if (!name || !email || !password || !suscription_idsuscription) {
      return res.status(400).json({ error: 'Bad Request' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'UPDATE user SET is_admin = ?, name = ?, email = ?, password_hash = ?, suscription_idsuscription = ? WHERE iduser = ?',
      [is_admin, name, email, password_hash, suscription_idsuscription, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ iduser: Number(req.params.id), is_admin, name, email, suscription_idsuscription });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const remove = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM user WHERE iduser = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Bad Request' });
    const [rows] = await db.query(
      'SELECT iduser, is_admin, name, email, suscription_idsuscription, password_hash FROM user WHERE email = ?',
      [email]
    );
    if (!rows[0]) return res.status(401).json({ error: 'Credenciales inválidas' });
    const coincide = await bcrypt.compare(password, rows[0].password_hash);
    if (!coincide) return res.status(401).json({ error: 'Credenciales inválidas' });
    const { password_hash, ...user } = rows[0];
    res.json({ message: 'Inicio de sesión exitoso', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove, login };