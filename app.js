require("dotenv").config();
const express = require("express");
const app = express();

// Import the client from the db/index file
const { client } = require("./db");

// Setup your Middleware and API Router here
// Morgan
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.json());

// Cors
const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  console.log("====Body Logger START====");
  console.log(req.body);
  console.log("====Body Logger END====");

  next();
});

app.use("/api", require("./api"));

app.use("*", (req, res, next) => {
  res.status(404);
  res.send({ error: "route not found" });
});

module.exports = app;
