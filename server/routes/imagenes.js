const express = require('express');
const fs = require('fs');
const { verification } = require('../middlewares/authentication');
let app = express();
let path = require('path');

app.get('/imagen/:type/:img', verifica_token_img, (req, res) => {
    let body = req.params;
    let path_img = path.resolve(__dirname, `../uploads/${body.type}/${body.img}`);
    if (fs.existsSync(path_img)) {
        res.sendFile(path_img);
    } else {
        let no_img = path.resolve(__dirname, '../assets/no_image.jpg');
        res.sendFile(no_img);
    }
})

module.exports = app;