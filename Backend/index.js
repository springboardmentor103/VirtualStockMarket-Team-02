const mongodb = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

mongodb().then(() => {
    app.use(cors(
        {
            origin: '*'
        }

    ));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
    app.use('/api',require('./Routes/CreateUser'));
    app.use('/api',require('./Routes/LoginUser'));
    app.listen(port, () => {
        console.log(`Virtual dtock market Platform listening on port ${port}`);
    });

}).catch((err)=>{console.log(err)});
