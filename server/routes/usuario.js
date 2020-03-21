const express = require('express');
// encripta datos mediate una funcion hash
const bcrypt = require('bcrypt');
const __ = require('underscore');
const { verification, verifica_role } = require('../middlewares/authentication');
const app = express();
const Usuario = require('../models/usuario');
// el path es definido por path del request, midlewares, (req,res)
app.get('/usuario', verification, (req, res) => {
    // con el metodo exec ejecuta el comando mas veloz que si no tuviera en exec()
    // con el metodo limit permite restringir el numero de resultados
    // el comando skip funciona para saltar un determinado numero de resultados en el total
    let from = Number(req.query.from) || 0;
    let to = Number(req.query.to) || 5;
    // el segundo parametro del find permite elegir los parametros que se necesitan en los resultados
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(from)
        .limit(to)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            // con la funcion count se realiza un conteo de la cantidad de resultados
            // lo mejor es que se pueden contar el numero de resultados segun una condicion
            Usuario.count({ estado: true }, (error, cuantos) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        error
                    })
                }
                res.json({
                    ok: true,
                    usuarios,
                    count: cuantos
                });
            })
        })
})
app.post('/usuario', [verification, verifica_role], (req, res) => {
    let body = req.body;
    console.log(body)
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    console.log(usuario);
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {
            return res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    })


})
app.put('/usuario/:id', [verification, verifica_role], (req, res) => {
    let id = req.params.id;
    console.log(id)
    let body = __.pick(req.body, [
        'nombre', 'email', 'img', 'role', 'estado'
    ]);
    console.log(body.email);
    /**
     Usuario.findById(id, body, (err, mongoUser) => {
         if (err) {
             return res.status().json({
                 ok: false,
                 err
             })
         }
         res.json({
             ok: true,
             usuario: mongoUser
         })
     })
     * 
     */
    Usuario.findOneAndUpdate({ email: id }, body, { new: true, runValidators: true }, (err, mongoUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        console.log(mongoUser);
        res.json({
            ok: true,
            usuario: mongoUser
        })
    })

})

app.delete('/usuario/:id', [verification, verifica_role], (req, res) => {
    let id = req.params.id;
    Usuario.findOneAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, mongoUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        let salida = __.pick(mongoUser, ['nombre', 'email'])
        console.log(mongoUser);
        res.json({
            ok: true,
            usuario: salida
        })
    })
})


// funcion de remove a user
app.delete('/remove/:id', verification, (req, res) => {
    let id = req.params.email;
    Usuario.findOneAndRemove({ email: id }, (err, user_deleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else if (!user_deleted) {
            return res.json({
                ok: true,
                err: {
                    message: 'No se encontro el usuario'
                }
            })
        }
        console.log(user_deleted);
        res.json({
            ok: true,
            user_deleted
        })
    })
})
module.exports = app;