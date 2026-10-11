const express = require('express');
const router = express.Router();

const userDao = require('../dao/user');
const suscriptionDao = require('../dao/suscription');
const songDao = require('../dao/song');
const playlistDao = require('../dao/playlist');
const reviewDao = require('../dao/rewiew');

/////comprobar si funciona: http://127.0.0.1:5000/main/test
router.get('/test', (req, res) => {
  res.json({ message: 'Sturafon forever' });
});

////login
router.post('/login', userDao.login);

/////suscriptions
router.get('/suscriptions', suscriptionDao.getAll);
router.get('/suscriptions/:id', suscriptionDao.getById);
router.post('/suscriptions', suscriptionDao.create);
router.put('/suscriptions/:id', suscriptionDao.update);
router.delete('/suscriptions/:id', suscriptionDao.remove);

/////users
router.get('/users', userDao.getAll);
router.get('/users/:id', userDao.getById);
router.post('/users', userDao.create);
router.put('/users/:id', userDao.update);
router.delete('/users/:id', userDao.remove);
router.get('/users/:id/playlists', playlistDao.getByUser);

/////songs
router.get('/songs', songDao.getAll);
router.get('/songs/:id', songDao.getById);
router.post('/songs', songDao.create);
router.put('/songs/:id', songDao.update);
router.delete('/songs/:id', songDao.remove);
router.get('/songs/:id/reviews', reviewDao.getBySong);

//////playlists
router.get('/playlists', playlistDao.getAll);
router.get('/playlists/:id', playlistDao.getById);
router.post('/playlists', playlistDao.create);
router.put('/playlists/:id', playlistDao.update);
router.delete('/playlists/:id', playlistDao.remove);
router.get('/playlists/:id/songs', playlistDao.getSongs);
router.post('/playlists/:id/songs', playlistDao.addSong);
router.delete('/playlists/:id/songs/:songId', playlistDao.removeSong);

///////rewiews
router.get('/reviews', reviewDao.getAll);
router.get('/reviews/:id', reviewDao.getById);
router.post('/reviews', reviewDao.create);
router.put('/reviews/:id', reviewDao.update);
router.delete('/reviews/:id', reviewDao.remove);

module.exports = router;