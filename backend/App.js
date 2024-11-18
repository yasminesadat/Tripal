// External variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const colors = require("colors");

require("dotenv").config();

const MongoURI = process.env.MONGO_URI;

//App variables
const app = express();
const port = process.env.PORT || "5050";

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

//Route Imports
const routes = require("./routes/index");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use("/", routes);

//module.exports = amadeus;
