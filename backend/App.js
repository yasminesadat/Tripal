// External variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const colors = require("colors");

require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

//App variables
const app = express();
const port = process.env.PORT || "5000";

//Route Imports
const routes = require("./routes/index");
app.use(cors());

// configurations
// Mongo DB
mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(port, () => {
      console.log(
        `Listening to requests on http://localhost:${port}`.cyan.underline
      );
    });
  })
  .catch((err) => console.log(err));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes);
