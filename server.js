const express = require('express');
const mainRoutes = require('./routes/main.routes');

const api = express();
const port = 5000;

// Base URL http://localhost:5000/main
api.use(express.json());
api.use('/main', mainRoutes);

api.listen(port, () => {
  console.log('Server Running in http://localhost:5000');
});