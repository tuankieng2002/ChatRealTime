const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencode request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// enable cors
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("this is my server");
});

// v1 api routes
app.use("/v1", routes);

app.all("*", (req, res, next) => {
  return res
    .status(200)
    .json({ status: 404, message: "not found", data: null });
});

module.exports = app;
