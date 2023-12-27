const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const Joi = require('joi');
const uniqid = require('uniqid')
const pathToUsers = path.join(__dirname, 'users.json');
const data = JSON.parse(fs.readFileSync(pathToUsers, 'utf-8'));

const schema = Joi.object({
    userName: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    email: Joi.string().min(5).required()    
})

app.use(express.json());
// const users = [
//     {
//         id: 1,
//         userName: "Anatoly",
//         password: "649864",
//         email: "Anatoly186@mail.ru"
//     },

//     {
//         id: 2,
//         userName: "Victor",
//         password: "89654684",
//         email: "Victor95@mail.ru"
//     },

//     {
//         id: 3,    
//         userName: "Shingis",
//         password: "6845168",
//         email: "Shingis1337@mail.ru"
//     }
// ]



app.get("/users", (req, res) => {
    res.send({data})
    fs.writeFileSync(pathToUsers, JSON.stringify(data, null, 2));
})

app.post("/users", (req, res) => {
    let newId = uniqid();
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).send({error: result.error.details});
    }
    data.push({id: newId, ...req.body});
    res.send({id: newId});
    fs.writeFileSync(pathToUsers, JSON.stringify(data, null, 2));
})

app.put("/users/:id", (req, res) => {
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(404).sendStatus({error: result.error.details});
    }
    const id = req.params.id;
    const user = data.find((user) => user.id === id);
    if (user) {
        user.userName = req.body.userName;
        user.password = req.body.password;
        user.email = req.body.email;
        res.send({user});
        fs.writeFileSync(pathToUsers, JSON.stringify(data, null, 2));
    }else{
        res.status(404);
        res.send({user: null})
    }
    
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    const user = data.find((user) => user.id === id);
    if (user) {
        res.send({user});
        fs.writeFileSync(pathToUsers, JSON.stringify(data, null, 2));
    }else{
        res.status(404);
        res.send({user: null})
    }
    
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const user = data.find((user) => user.id === id);
    if (user) {
        const userIndex = data.indexOf(user);
        data.splice(userIndex, 1);
        res.send({user});
        fs.writeFileSync(pathToUsers, JSON.stringify(data, null, 2));
        
    }else{
        res.status(404);
        res.send({user: null})
    }
    
});



app.listen(3000);
