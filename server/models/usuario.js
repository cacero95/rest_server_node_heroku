const mongoose = require('mongoose');
/**
 * mongoose-unique-validator funciona para verificar que no entren
 * valores repetidos a la dba
 */
const uniquevalidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let roles_validos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}
let usuario_schema = new Schema({
    nombre: {
        type: String,
        required: [true, 'The name is necesary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'the email is necesary']
    },
    password: {
        type: String,
        required: [true, 'The password is necesary']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roles_validos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
/**
 * usuario_schema.methods.toJSON llama todos los metodos
 * y caracterizticas del esquema que se va almacenar y los
 * convierte en un JSON 
 */
usuario_schema.methods.toJSON = function() {
    let user = this;
    let user_object = user.toObject();
    // de esta manera elimino el password cuando 
    // se valla mandar la respuesta despues de un request
    // tipo POST
    delete user_object.password;
    return user_object;
}
usuario_schema.plugin(uniquevalidator, {
    message: '{PATH} have to be unique'
})
module.exports = mongoose.model('Usuario', usuario_schema);