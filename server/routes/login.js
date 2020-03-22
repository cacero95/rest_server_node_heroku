const express = require('express');
// encripta datos mediate una funcion hash
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let google_user = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        })
    Usuario.findOne({ email: google_user.email }, (err, mongoUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        } else if (mongoUser) {
            if (mongoUser.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el ta tiene cuenta mongo'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: mongoUser
                }, process.env.SEED, { expiresIn: process.env.EXPIRED_TOKEN });
                return res.json({
                    ok: true,
                    usuario: mongoUser,
                    token
                })
            }
        } else {
            // si el usuario no existe en la base de datos

            let usuario = new Usuario({
                nombre: google_user.nombre,
                email: google_user.email,
                google: true,
                img: google_user.img,
                password: ':)'
            });
            usuario.save((err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                let token = jwt.sign({
                    usuario: mongoUser
                }, process.env.SEED, { expiresIn: process.env.EXPIRED_TOKEN });
                return res.json({
                    ok: true,
                    usuario,
                    token
                })
            })

        }
    })
})
module.exports = app;