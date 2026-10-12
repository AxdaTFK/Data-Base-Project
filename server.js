const express = require('express');
const mainRoutes = require('./routes/main.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./env/swagger.config');

const api = express();
const port = 5000;

// Base URL http://localhost:5000/main
api.use(express.json());
api.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
api.use('/main', mainRoutes);

api.listen(port, () => {
  console.log('Server Running in http://localhost:5000');
  
});