const swaggerJsdoc = require('swagger-jsdoc');

const errorContent = (example) => ({
  'application/json': {
    schema: { $ref: '#/components/schemas/Error' },
    example: { message: example },
  },
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Data-Base-Project API',
      version: '1.0.0',
      description:
        'API REST para usuarios, suscripciones, canciones, playlists, tracklist y resenas',
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
          content: errorContent('Datos incompletos'),
        },
        Unauthorized: {
          description: 'Credenciales incorrectas',
          content: errorContent('Credenciales incorrectas'),
        },
        NotFound: {
          description: 'El recurso no existe',
          content: errorContent('No encontrado'),
        },
        ServerError: {
          description: 'Error interno del servidor',
          content: errorContent('Error interno'),
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },

        // ---------- Auth ----------
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'ana@correo.com' },
            password: { type: 'string', example: '123456' },
          },
        },

        // ---------- User ----------
        User: {
          type: 'object',
          properties: {
            iduser: { type: 'integer', example: 1 },
            is_admin: { type: 'integer', example: 0 },
            name: { type: 'string', example: 'Ana' },
            email: { type: 'string', example: 'ana@correo.com' },
            password: { type: 'string', example: '123456' },
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
            password: { type: 'string', example: '123456' },
            suscription_idsuscription: { type: 'integer', example: 1 },
          },
        },

        // ---------- Suscription ----------
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

        // ---------- Song ----------
        Song: {
          type: 'object',
          properties: {
            idsong: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Mi cancion' },
            duration: { type: 'integer', example: 215 },
          },
        },
        SongInput: {
          type: 'object',
          required: ['name', 'duration'],
          properties: {
            name: { type: 'string', example: 'Mi cancion' },
            duration: { type: 'integer', example: 215 },
          },
        },

        // ---------- Playlist ----------
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

        // ---------- Tracklist ----------
        TracklistInput: {
          type: 'object',
          required: ['song_idsong'],
          properties: { song_idsong: { type: 'integer', example: 1 } },
        },

        // ---------- Review ----------
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
          required: ['comment', 'qualification', 'song_idsong', 'user_iduser'],
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