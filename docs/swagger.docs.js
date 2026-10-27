/**
 * @swagger
 * /test:
 *   get:
 *     summary: Prueba de que el servidor funciona
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Servidor funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stuffaron funciona bien
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesion
 *     description: Compara el correo y la contrasena con los datos guardados y devuelve el usuario sin su contrasena
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Credenciales validas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /suscriptions:
 *   get:
 *     summary: Obtener todas las suscripciones
 *     tags: [Suscriptions]
 *     responses:
 *       200:
 *         description: Lista de suscripciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Suscription'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /suscriptions/{id}:
 *   get:
 *     summary: Obtener suscripcion por id
 *     tags: [Suscriptions]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Suscripcion encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suscription'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /suscriptions:
 *   post:
 *     summary: Crear suscripcion
 *     tags: [Suscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuscriptionInput'
 *     responses:
 *       201:
 *         description: Suscripcion creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suscription'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /suscriptions/{id}:
 *   put:
 *     summary: Actualizar suscripcion
 *     tags: [Suscriptions]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuscriptionInput'
 *     responses:
 *       200:
 *         description: Suscripcion actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Suscription'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /suscriptions/{id}:
 *   delete:
 *     summary: Eliminar suscripcion
 *     tags: [Suscriptions]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Suscripcion eliminada
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todas las usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por id
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Usuario encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuario creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Usuario actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /users/{id}/playlists:
 *   get:
 *     summary: Obtener las playlists de un usuario
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Playlists del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /songs:
 *   get:
 *     summary: Obtener todas las canciones
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: Lista de canciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /songs/{id}:
 *   get:
 *     summary: Obtener cancion por id
 *     tags: [Songs]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Cancion encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /songs:
 *   post:
 *     summary: Crear cancion
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SongInput'
 *     responses:
 *       201:
 *         description: Cancion creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /songs/{id}:
 *   put:
 *     summary: Actualizar cancion
 *     tags: [Songs]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SongInput'
 *     responses:
 *       200:
 *         description: Cancion actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /songs/{id}:
 *   delete:
 *     summary: Eliminar cancion
 *     tags: [Songs]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Cancion eliminada
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /songs/{id}/reviews:
 *   get:
 *     summary: Obtener las resenas de una cancion
 *     tags: [Songs]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Resenas de la cancion
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /playlists:
 *   get:
 *     summary: Obtener todas las playlists
 *     tags: [Playlists]
 *     responses:
 *       200:
 *         description: Lista de playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /playlists/{id}:
 *   get:
 *     summary: Obtener playlist por id
 *     tags: [Playlists]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Playlist encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Crear playlist
 *     tags: [Playlists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistInput'
 *     responses:
 *       201:
 *         description: Playlist creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /playlists/{id}:
 *   put:
 *     summary: Actualizar playlist
 *     tags: [Playlists]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaylistInput'
 *     responses:
 *       200:
 *         description: Playlist actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /playlists/{id}:
 *   delete:
 *     summary: Eliminar playlist
 *     tags: [Playlists]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Playlist eliminada
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /playlists/{id}/songs:
 *   get:
 *     summary: Obtener las canciones de una playlist
 *     tags: [Tracklist]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Canciones de la playlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /playlists/{id}/songs:
 *   post:
 *     summary: Agregar una cancion a una playlist
 *     tags: [Tracklist]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TracklistInput'
 *     responses:
 *       201:
 *         description: Cancion agregada a la playlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TracklistItem'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         description: Error interno del servidor (por ejemplo, la cancion ya esta en la playlist, o la playlist o la cancion no existen)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /playlists/{id}/songs/{songId}:
 *   delete:
 *     summary: Quitar una cancion de una playlist
 *     tags: [Tracklist]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cancion eliminada de la playlist
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Obtener todas las resenas
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Lista de resenas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Obtener resena por id
 *     tags: [Reviews]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Resena encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Crear resena
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Resena creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Actualizar resena
 *     tags: [Reviews]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       200:
 *         description: Resena actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Eliminar resena
 *     tags: [Reviews]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Resena eliminada
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /artists:
 *   get:
 *     summary: Obtener todos los artistas
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Lista de artistas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artist'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /artists/{id}:
 *   get:
 *     summary: Obtener artista por id
 *     tags: [Artists]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Artista encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /artists:
 *   post:
 *     summary: Crear artista
 *     tags: [Artists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtistInput'
 *     responses:
 *       201:
 *         description: Artista creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /artists/{id}:
 *   put:
 *     summary: Actualizar artista
 *     tags: [Artists]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtistInput'
 *     responses:
 *       200:
 *         description: Artista actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Artist'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /artists/{id}:
 *   delete:
 *     summary: Eliminar artista
 *     tags: [Artists]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       204:
 *         description: Artista eliminado
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */