// External variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const colors = require("colors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const MongoURI = process.env.MONGO_URI;

//App variables
const app = express();
const port = process.env.PORT || "5050";

//Route Imports
const routes = require("./routes/index");
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Increase payload size limit
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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

app.use(cookieParser());
app.use("/", routes);
