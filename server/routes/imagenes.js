const express = require('express');
const fs = require('fs');
let app = express();
let path = require('path');

app.get('/imagen/:type/:img', (req, res) => {
    let body = req.params;
    let no_img = path.resolve(__dirname, '../assets/no_image.jpg');
    let path_img = path.resolve(__dirname, `../uploads/${body.type}/${body.img}`);
    res.sendFile(no_img);
})

module.exports = app;