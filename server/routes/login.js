const express = require('express');
// encripta datos mediate una funcion hash
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;
    console.log(body)
    Usuario.findOne({ email: body.email }, (err, usuariodb) => {
        console.log(usuariodb)
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        } else if (!usuariodb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(usuario) contraseña incorrecta'
                }
            })
        } else if (!bcrypt.compareSync(body.password, usuariodb.password)) {
            return res.status(400), json({
                ok: false,
                message: 'contraseña sin hacer paring'
            })
        }
        let token = jwt.sign({
            usuario: usuariodb
                // el formato del expiresIn es segundos minutos dias meses
                // en este caso 60 segundos 60 minutos 24 horas 30 dias osea expira en 30 dias 
        }, process.env.SEED, { expiresIn: process.env.EXPIRED_TOKEN });
        res.json({
            ok: true,
            usuario: usuariodb,
            token
        })
    })
})

module.exports = app;