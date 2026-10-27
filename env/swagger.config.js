const swaggerJsdoc = require('swagger-jsdoc');

const errorContent = (example) => ({
  'application/json': {
    schema: { $ref: '#/components/schemas/Error' },
    example: { error: example },
  },
});
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Data-Base-Project API',
      version: '1.0.0',
      description:
        'API REST para usuarios, suscripciones, canciones, artistas, playlists, tracklist y resenas',
    },
    servers: [{ url: 'http://localhost:5000/main' }],
    components: {
      parameters: {
        IdParam: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'Identificador del recurso',
        },
      },
      responses: {
        BadRequest: {
          description: 'Datos incompletos o invalidos',
          content: errorContent('Bad Request'),
        },
        Unauthorized: {
          description: 'Credenciales incorrectas',
          content: errorContent('Credenciales inválidas'),
        },
        NotFound: {
          description: 'El recurso no existe',
          content: errorContent('No encontrado'),
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: errorContent('Mensaje del error generado en el servidor'),
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'ana@correo.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Inicio de sesión exitoso' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        User: {
          type: 'object',
          properties: {
            iduser: { type: 'integer', example: 1 },
            is_admin: { type: 'integer', example: 0 },
            name: { type: 'string', example: 'Ana' },
            email: { type: 'string', example: 'ana@correo.com' },
            suscription_idsuscription: { type: 'integer', example: 1 },
          },
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password', 'suscription_idsuscription'],
          properties: {
            is_admin: { type: 'integer', example: 0 },
            name: { type: 'string', example: 'Ana' },
            email: { type: 'string', example: 'ana@correo.com' },
            password: {
              type: 'string',
              example: '123456',
              description: 'Se envia en texto y el servidor la guarda cifrada con bcrypt',
            },
            suscription_idsuscription: { type: 'integer', example: 1 },
          },
        },
        Suscription: {
          type: 'object',
          properties: {
            idsuscription: { type: 'integer', example: 1 },
            type: { type: 'string', example: 'premium' },
          },
        },
        SuscriptionInput: {
          type: 'object',
          required: ['type'],
          properties: { type: { type: 'string', example: 'premium' } },
        },
        Song: {
          type: 'object',
          properties: {
            idsong: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Mi cancion' },
            duration: { type: 'integer', example: 215 },
            album: { type: 'string', nullable: true, example: 'Mi album' },
            artist_idartist: { type: 'integer', example: 1 },
          },
        },
        SongInput: {
          type: 'object',
          required: ['name', 'duration', 'artist_idartist'],
          properties: {
            name: { type: 'string', example: 'Mi cancion' },
            duration: { type: 'integer', example: 215 },
            album: { type: 'string', nullable: true, example: 'Mi album' },
            artist_idartist: { type: 'integer', example: 1 },
          },
        },
        Artist: {
          type: 'object',
          properties: {
            idartist: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Mi artista' },
          },
        },
        ArtistInput: {
          type: 'object',
          required: ['name'],
          properties: { name: { type: 'string', example: 'Mi artista' } },
        },
        Playlist: {
          type: 'object',
          properties: {
            idplaylist: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Favoritas' },
            user_iduser: { type: 'integer', example: 1 },
          },
        },
        PlaylistInput: {
          type: 'object',
          required: ['name', 'user_iduser'],
          properties: {
            name: { type: 'string', example: 'Favoritas' },
            user_iduser: { type: 'integer', example: 1 },
          },
        },
        TracklistInput: {
          type: 'object',
          required: ['song_idsong'],
          properties: { song_idsong: { type: 'integer', example: 1 } },
        },
        TracklistItem: {
          type: 'object',
          properties: {
            idplaylist: { type: 'integer', example: 1 },
            song_idsong: { type: 'integer', example: 1 },
          },
        },
        Review: {
          type: 'object',
          properties: {
            idreview: { type: 'integer', example: 1 },
            tag: { type: 'string', example: 'rock' },
            comment: { type: 'string', example: 'Muy buena' },
            qualification: { type: 'integer', example: 5 },
            metrics: { type: 'string', example: '100' },
            song_idsong: { type: 'integer', example: 1 },
            user_iduser: { type: 'integer', example: 1 },
          },
        },
        ReviewInput: {
          type: 'object',
          required: ['qualification', 'song_idsong', 'user_iduser'],
          properties: {
            tag: { type: 'string', example: 'rock' },
            comment: { type: 'string', example: 'Muy buena' },
            qualification: { type: 'integer', example: 5 },
            metrics: { type: 'string', example: '100' },
            song_idsong: { type: 'integer', example: 1 },
            user_iduser: { type: 'integer', example: 1 },
          },
        },
      },
    },
  },
  apis: ['./docs/*.js'],
};

module.exports = swaggerJsdoc(options);