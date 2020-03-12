require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.get('/usuario', (req, res) => {
    res.json('Hellow world')
})
app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            nombre: 'El nombre es necesario'
        })
    } else {
        res.json({
            ok: true,
            body
        });
    }
})
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
})
app.delete('/usuario', (req, res) => {

})
app.listen(process.env.PORT, () => {
    console.log(`hear by the port ${process.env.PORT}`);
})