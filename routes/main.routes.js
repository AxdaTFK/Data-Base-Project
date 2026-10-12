const express = require('express');
const router = express.Router();

const userDao = require('../dao/user');
const suscriptionDao = require('../dao/suscription');
const songDao = require('../dao/song');
const playlistDao = require('../dao/playlist');
const reviewDao = require('../dao/rewiew');
const tracklistDao = require('../dao/tracklist');

////// Prueba para el servidor http://localhost:5000/main/test
router.get('/test', (req, res) => {
  res.json({ message: 'Stufaron funciona bien' });
});

router.post('/login', userDao.login);

router.get('/suscriptions', suscriptionDao.getAll);
router.get('/suscriptions/:id', suscriptionDao.getById);
router.post('/suscriptions', suscriptionDao.create);
router.put('/suscriptions/:id', suscriptionDao.update);
router.delete('/suscriptions/:id', suscriptionDao.remove);

router.get('/users', userDao.getAll);
router.get('/users/:id', userDao.getById);
router.post('/users', userDao.create);
router.put('/users/:id', userDao.update);
router.delete('/users/:id', userDao.remove);
router.get('/users/:id/playlists', playlistDao.getByUser);

router.get('/songs', songDao.getAll);
router.get('/songs/:id', songDao.getById);
router.post('/songs', songDao.create);
router.put('/songs/:id', songDao.update);
router.delete('/songs/:id', songDao.remove);
router.get('/songs/:id/reviews', reviewDao.getBySong);

router.get('/playlists', playlistDao.getAll);
router.get('/playlists/:id', playlistDao.getById);
router.post('/playlists', playlistDao.create);
router.put('/playlists/:id', playlistDao.update);
router.delete('/playlists/:id', playlistDao.remove);

router.get('/playlists/:id/songs', tracklistDao.getSongs);
router.post('/playlists/:id/songs', tracklistDao.addSong);
router.delete('/playlists/:id/songs/:songId', tracklistDao.removeSong);

router.get('/reviews', reviewDao.getAll);
router.get('/reviews/:id', reviewDao.getById);
router.post('/reviews', reviewDao.create);
router.put('/reviews/:id', reviewDao.update);
router.delete('/reviews/:id', reviewDao.remove);

module.exports = router;