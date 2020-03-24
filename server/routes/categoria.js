const express = require('express');
let { verification, verifica_role } = require('../middlewares/authentication');
let app = express();
let Categoria = require('../models/categoria');
const __ = require('underscore');
// muestra todos los registros
app.get('/catalogo', verification, (req, res) => {
        // usuario que hizo el request
        let in_user = __.pick(req.usuario, [
            'nombre', 'email'
        ]);
        Categoria.find({})
            .sort('name')
            .populate('usuarios', 'nombre')
            .exec((err, categorias) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                Categoria.count({}, (error, count) => {
                    if (error) {
                        res.status(500).json({
                            ok: false,
                            err: error
                        })
                    }
                    res.json({
                        ok: true,
                        usuario: in_user,
                        categorias,
                        count
                    })
                })
            })
    })
    // filtra solo la categoria que necesito
app.get('/catalogo/:name', (req, res) => {
        let id = req.params.name;
        Categoria.findOne({ name: id }, (err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.count({ name: id }, (error, count) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        err: error
                    })
                }
                res.json({
                    ok: true,
                    categorias,
                    count
                })
            })
        })
    })
    // crea una nueva categoria
app.post('/catalogo', [verification, verifica_role], (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        description: body.description,
        name: body.name
    })
    console.log(categoria);
    categoria.save((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        } else if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Bad request'
                }
            })
        }
        res.json({
            ok: true,
            categoria
        })
    })
})

app.put('/catalogo/:id', [verification, verifica_role], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Categoria.findById(id, body, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else if (!categoria) {
            return res.status.json({
                ok: false,
                err: {
                    message: 'No se encontro esa categoria'
                }
            })
        }
        res.json({
            ok: true,
            categoria
        })
    });
})
app.delete('/catalogo/:id', [verification, verifica_role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        } else if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro esa categoria'
                }
            })
        }
        res.json({
            ok: true,
            categoria
        })
    });
})

module.exports = app;