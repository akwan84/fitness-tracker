const swaggerJSDoc = require('swagger-jsdoc');
// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Fitness Tracker API',
        version: '1.0.0',
        description: 'API for a fitness tracker app',
    },
    servers: [
        {
            url: 'http://localhost:3500',
            description: 'Development server',
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
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

// Options for swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ['./controllers/*.js'], // Paths to files containing OpenAPI definitions
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerDefinition, options, swaggerSpec };