// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
const MongoURI = process.env.MONGO_URI;
const cors = require('cors');

//App variables
const app = express();
const port = process.env.PORT || "8000";

//Route Imports
const routes = require('./routes/index');
app.use(cors());

// configurations
// Mongo DB
mongoose.connect(MongoURI)
    .then(() => {
        console.log("MongoDB is now connected!")
        // Starting server
        app.listen(port, () => {
            console.log(`Listening to requests on http://localhost:${port}`);
        })
    })
    .catch(err => console.log(err));

app.use(express.json())
app.use('/', routes);
