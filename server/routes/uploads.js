const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { search_id } = require('../middlewares/authentication');
const Usuario = require('../models/usuario');
const Producto = require('../models/productos');
const fs = require('fs');
const path = require('path');

// el middleware fileUpload add todos los archivos que se estan subiendo
// a req.files
app.use(fileUpload());
// el tipe permite distinguir si la imagen que se esta subiendo
// va para carpeta usuarios o para la carpeta productos
// el id identifica a que producto o usuario se le va asignar la img
app.put('/upload/:type/:id', search_id, (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded'
            }
        })
    }

    let file = req.files.data;
    let file_name = file.name.split('.');
    /**
     * extensiones validas
     */
    let formats = ['png', 'jpg', 'gif', 'jpeg'];
    if (formats.indexOf(file_name[file_name.length - 1]) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Unsupported format, the supported formats are:' + formats.join(','),
                formats
            }
        })
    }
    let name_file = `${new Date().valueOf().toString()}.${file_name[file_name.length-1]}`;
    /**
     let extension_file = `server/uploads/usuario/${name_file}` ? req.params.type == 'usuario' : `server/uploads/productos/${name_file}`;
     * 
     */
    let extension_file;
    if (req.params.type == 'usuario') {
        extension_file = `server/uploads/usuarios/${name_file}`;
    } else {
        extension_file = `server/uploads/productos/${name_file}`;
    }
    file.mv(extension_file, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        } else if (req.params.type == 'usuario') {
            update_user(req.result_id, name_file, res);
        } else {
            update_product(req.result_id, name_file, res)
        }

    });
})

let update_user = async(user, extension_file, res) => {
    borrar_imagen('usuarios', user.img);
    user.img = `${extension_file}`;
    user.save((err, usuarioDb) => {
        if (err) {
            // si no actualizar la data del usario se elimina el file que se almaceno
            borrar_imagen('usuarios', extension_file);
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDb
        })
    })
}
let update_product = async(producto, extension_file, res) => {
    borrar_imagen('productos', producto.img);
    producto.img = extension_file;
    producto.save((err, productos) => {
        if (err) {
            borrar_imagen('productos', extension_file);
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
}
let borrar_imagen = (type, user_img) => {
    let path_img = path.resolve(__dirname, `../uploads/${type}/${user_img}`);
    // fs.existsSync permite verificar si el file existe en el servidor
    if (fs.existsSync(path_img)) {
        // con el unlinkSync se eliminan elementos del servidor
        fs.unlinkSync(path_img);
    }
}

module.exports = app;