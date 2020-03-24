const express = require('express');
const { verification, search_category } = require('../middlewares/authentication');
let app = express();
let Categoria = require('../models/categoria');
let Producto = require('../models/productos');
// get all the products
app.get('/producto', (req, res) => {
    let from = Number(req.query.from) || 0;
    let to = Number(req.query.to) || 5;
    // para crear una expresion flexible o regular se usa el RegExp
    // tiene varias ventajas ya que con la i en el segundo parametro coge la expresion indiferente a mayusculas
    // o minusculas
    let onSearch = new RegExp(req.query.regular, 'i');
    Producto.find({ disponible: true, nombre: onSearch }).skip(from).limit(to)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            } else if (!productos) {
                return res.status(400).status({
                    ok: false,
                    err: {
                        message: 'Products were not found'
                    }
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})
app.get('/producto/:id', (req, res) => {
    let id = req.params.id; // el populate busca informacion en la dba segun el nombre de la collection en este caso
    // busca en la collection usuario y busca un usuario con el id que tiene el document
    // el segundo parametro salta los capos que ncesito del documento
    Producto.findById(id).populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            } else if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'The product was not found'
                    }
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})
app.post('/producto', [verification, search_category], (req, res) => {
    let body = req.body;
    // para identificar la categoria pedimos el nombre de la categoria en el body

    body.usuario = req.usuario._id;
    let producto = new Producto(body);
    producto.save((err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            productos
        })
    })

});

app.put('/producto/:id', [verification, search_category], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    console.log("hola", req.body)
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productos) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else if (!productos) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'the product could not found'
                }
            })
        }
        res.json({
            ok: true,
            productos
        })

    });
})
app.delete('/producto/:id', verification, (req, res) => {
    let id = req.params.id;
    Producto.findOneAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productos) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
        } else if (!productos) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'the product could not found'
                }
            })
        }
        res.json({
            ok: true,
            productos
        })
    })
})
module.exports = app;