const jwt = require('jsonwebtoken');
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario')
    /**
     * verificacion de tokens
     */
verification = (req, res, next) => {
        // para entrar a los headers de un request se usa el req
        let token = req.get('Authorization');
        jwt.verify(token, process.env.SEED, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    err
                })
            }
            req.usuario = decoded.usuario;
            next();
        })
    }
    // verifica si el usuario que entra es admin
let verifica_role = (req, res, next) => {
    if (req.usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: true,
            err: {
                message: 'Usuario no tiene permisos'
            }
        })
    }
}

let search_category = (req, res, next) => {
        let body = req.body;
        console.log(req.method);
        if (body.categoria) {
            Categoria.findOne({ name: body.categoria }, (err, categoria) => {

                if (err != null) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                } else if (!categoria) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Category could not found please verify the name'
                        }
                    })
                }
                req.categoria = categoria._id;
                req.body["categoria"] = categoria._id;
                console.log(req.body)
                next();
            });

        } else if (req.method === 'PUT') {
            next();
        } else {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'The category has to be provided'
                }
            })
        }
    }
    // middleware que distingue entre un usuario y un producto y retorna su id
search_id = (req, res, next) => {
    let id = req.params.id;
    let body = req.body;
    if (body.type != 'usuario' && body.type != 'producto') {
        res.status(400).json({
            ok: false,
            err: {
                message: 'The type provided is unsupported',
                supported: 'usuario,producto'
            }
        })
    } else {
        if (body.type == 'usuario') {

        } else {

        }
    }
}


module.exports = {
    verification,
    verifica_role,
    search_category
};