const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'The name on the catalog is neccesary']
    },
    description: {
        type: String,
        required: [true, 'Please give it a description']
    }
})

schema.plugin(uniquevalidator, {
    message: 'the {Path} must be unique '
})
module.exports = mongoose.model("Categoria", schema)