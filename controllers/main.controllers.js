const db = require('../db');

const getAllInfo = (req, res) =>{
    res.json(db);
};

const createInfo = (req, res)=> {
    const {id, Titulo, Duracion, Genero, Album} = req.body;
    if(!Titulo || !id || !Duracion || !Genero || !Album){
        res.send("Info Missing");
    }
    db.push({id: id, title: Titulo, duration: Duracion, genre: Genero, album: Album});
    res.send("Successfully saved");
};

//http://localhost:5000/main/id

const getById = (req, res) => {
    const id = req.params.id;
    const result = db.find((x)=>{
        return x.id == id;
    });
    if(!result){
        res.send("404 Not Found");
    }
    res.json(result);
}

module.exports = {getAllInfo, createInfo, getById};