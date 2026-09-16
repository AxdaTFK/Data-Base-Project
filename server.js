const express = require('express');
const mainRoutes = require('./routes/main.routes');

const api = express();
const port = 5000; //Se conoce como el puerto universal plug and play (Puerto libre para desarrollo).

//Base URL http://localhost:5000/ -> Endpoint
api.use(express.json()); //Indicar que pueda leer .json
api.use("/main", mainRoutes)

//Inicializar API a escuchar peticiones
api.listen(port, ()=>{
  console.log("Server Running in http://localhost:5000");
}); //Antes de listen se hace todo, esto es lo último.


