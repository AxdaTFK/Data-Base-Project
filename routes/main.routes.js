const express = require('express');
const router = express.Router(); //Se necesita un router -> Objeto que conecta las rutas
const mainController = require('./../controllers/main.controllers');

//http://127.0.0.1:5000/
router.get("/",mainController.getAllInfo);
router.post("/",mainController.createInfo);
router.get("/:id",mainController.getById);

router.get("/test", (req, res)=>{
  res.send("<h2>Algo X</h2><br><h3>Funciona porfavor</h3>"+"<button>Presiona</button>");
});

module.exports = router;



