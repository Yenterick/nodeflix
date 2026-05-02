const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nodeflix API',
      version: '3.0.0',
      description: 'API documentation for the Nodeflix streaming platform.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server.',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            msg: { type: 'string' },
            data: { type: 'object' },
          },
        },
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'string' },
            email: { type: 'string' },
          },
        },
        Profile: {
          type: 'object',
          properties: {
            profile_id: { type: 'string' },
            name: { type: 'string' },
            profile_pic: { type: 'string' },
            is_for_kids: { type: 'boolean' },
            user_id: { type: 'string' },
          },
        },
        Movie: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            genres: { type: 'array', items: { type: 'string' } },
            description: { type: 'string' },
            release_date: { type: 'string' },
            duration: { type: 'number' },
            stream_url: { type: 'string' },
            thumbnail_url: { type: 'string' },
            is_for_kids: { type: 'boolean' },
          },
        },
        Series: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            genres: { type: 'array', items: { type: 'string' } },
            description: { type: 'string' },
            release_date: { type: 'string' },
            is_for_kids: { type: 'boolean' },
            seasons: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Season',
              },
            },
          },
        },
        Season: {
          type: 'object',
          properties: {
            season_number: { type: 'number' },
            episodes: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Episode',
              },
            },
          },
        },
        Episode: {
          type: 'object',
          properties: {
            episode_number: { type: 'number' },
            title: { type: 'string' },
            description: { type: 'string' },
            duration: { type: 'number' },
            stream_url: { type: 'string' },
            thumbnail_url: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
