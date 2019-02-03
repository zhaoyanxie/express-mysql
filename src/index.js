const express = require("express");

const index = require("./routers/index");
const api = require("./routers/api");
const setupTestDB = require("./setupDb");

const app = express();

if (process.env.NODE_ENV === "development") {
  setupTestDB();
}

app.use(express.json());

index(app);
api(app);

module.exports = app;
