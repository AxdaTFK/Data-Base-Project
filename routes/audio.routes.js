const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();
const audioDirectory = path.join(__dirname, '..', 'uploads', 'audio');
const audioFormats = {
  'audio/mpeg': '.mp3',
  'audio/mp3': '.mp3',
  'audio/wav': '.wav',
  'audio/x-wav': '.wav',
  'audio/ogg': '.ogg',
  'audio/mp4': '.m4a',
  'audio/aac': '.aac',
  'audio/webm': '.webm',
};
const audioExtensions = [...new Set(Object.values(audioFormats))];

fs.mkdirSync(audioDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: audioDirectory,
    filename: (req, file, callback) =>
      callback(null, req.params.id + audioFormats[file.mimetype]),
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, callback) =>
    callback(null, Boolean(audioFormats[file.mimetype])),
});

router.post('/songs/:id/audio', (req, res, next) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ error: 'ID de canción inválido.' });
  }

  upload.single('audio')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'El audio supera el límite de 50 MB.'
        : 'No se pudo procesar el archivo de audio.';
      return res.status(400).json({ error: message });
    }
    if (error) return next(error);
    if (!req.file) {
      return res.status(400).json({ error: 'Formato de audio no compatible.' });
    }

    res.status(201).json({ message: 'Audio guardado.' });
  });
});

router.get('/songs/:id/audio', (req, res) => {
  if (!/^[1-9]\d*$/.test(req.params.id)) {
    return res.status(400).json({ error: 'ID de canción inválido.' });
  }

  const audioPath = audioExtensions
    .map((extension) => path.join(audioDirectory, req.params.id + extension))
    .find((filePath) => fs.existsSync(filePath));

  if (!audioPath) return res.status(404).json({ error: 'No se encontró el audio.' });
  res.sendFile(audioPath);
});

module.exports = router;
