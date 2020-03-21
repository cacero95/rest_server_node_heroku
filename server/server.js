require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/routes'))

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) {
            throw new err;
        } else {
            console.log('database online');
        }
    })
app.listen(process.env.PORT, () => {
    console.log(`hear by the port ${process.env.PORT}`);
})