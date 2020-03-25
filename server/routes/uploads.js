const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// el middleware fileUpload add todos los archivos que se estan subiendo
// a req.files
app.use(fileUpload());
// el tipe permite distinguir si la imagen que se esta subiendo
// va para carpeta usuarios o para la carpeta productos
// el id identifica a que producto o usuario se le va asignar la img
app.put('/upload/:type/:id', (req, res) => {

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
    let extension_file = `server/uploads/${new Date().valueOf().toString()}.${file_name[file_name.length-1]}`;

    file.mv(extension_file, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: 'File uploaded'
        })
    });
})

module.exports = app;