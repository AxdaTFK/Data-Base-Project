const db = require('../db');

const getAllInfo = (req, res) =>{
    res.json(db);
};

const createInfo = (req, res)=> {
    const {id, name} = req.body;
    if(!name || !id){
        res.send("Información incompleta");
    }
    db.push({id: id, name: name});
    res.send("Guardado existosamente");
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