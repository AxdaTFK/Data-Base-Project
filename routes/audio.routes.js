const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();
const audioDirectoryPath = path.join(__dirname, "..", "uploads", "audio");
const supportedAudioFormats = {
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "audio/wav": ".wav",
  "audio/x-wav": ".wav",
  "audio/ogg": ".ogg",
  "audio/mp4": ".m4a",
  "audio/aac": ".aac",
  "audio/webm": ".webm",
};
const audioFileExtensions = [...new Set(Object.values(supportedAudioFormats))];

fs.mkdirSync(audioDirectoryPath, { recursive: true });

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: audioDirectoryPath,
    filename: (requestObject, fileObject, callbackFunction) =>
      callbackFunction(
        null,
        requestObject.params.id + supportedAudioFormats[fileObject.mimetype],
      ),
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (requestObject, fileObject, callbackFunction) =>
    callbackFunction(null, Boolean(supportedAudioFormats[fileObject.mimetype])),
});

router.post(
  "/songs/:id/audio",
  (requestObject, responseObject, nextFunction) => {
    if (!/^[1-9]\d*$/.test(requestObject.params.id)) {
      return responseObject
        .status(400)
        .json({ error: "ID de canción inválido." });
    }

    uploadMiddleware.single("audio")(
      requestObject,
      responseObject,
      (uploadError) => {
        if (uploadError instanceof multer.MulterError) {
          const errorMessage =
            uploadError.code === "LIMIT_FILE_SIZE"
              ? "El audio supera el límite de 50 MB."
              : "No se pudo procesar el archivo de audio.";
          return responseObject.status(400).json({ error: errorMessage });
        }
        if (uploadError) return nextFunction(uploadError);
        if (!requestObject.file) {
          return responseObject
            .status(400)
            .json({ error: "Formato de audio no compatible." });
        }

        responseObject.status(201).json({ message: "Audio guardado." });
      },
    );
  },
);

router.get("/songs/:id/audio", (requestObject, responseObject) => {
  if (!/^[1-9]\d*$/.test(requestObject.params.id)) {
    return responseObject
      .status(400)
      .json({ error: "ID de canción inválido." });
  }

  const targetAudioPath = audioFileExtensions
    .map((fileExtension) =>
      path.join(audioDirectoryPath, requestObject.params.id + fileExtension),
    )
    .find((filePath) => fs.existsSync(filePath));

  if (!targetAudioPath)
    return responseObject
      .status(404)
      .json({ error: "No se encontró el audio." });
  responseObject.sendFile(targetAudioPath);
});

module.exports = router;
