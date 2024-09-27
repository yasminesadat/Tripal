// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();

const routes = require ('./routes/preferenceTagRoutes');
const MongoURI = process.env.MONGO_URI;


//App variables
const app = express();
const port = process.env.PORT || "8000";
app.use(express.json())
app.use('/', routes)
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
/*
                                                    Start of your code
*/
app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
});






/*
                                                    End of your code
*/

