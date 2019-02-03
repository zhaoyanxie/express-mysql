const mysql = require("promise-mysql");

const { NODE_ENV, PRODUCTION_DB, DEVELOPMENT_DB } = process.env;
const db = NODE_ENV === "production" ? PRODUCTION_DB : DEVELOPMENT_DB;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: db,
  connectionLimit: 10
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }
  if (connection) connection.release();
  return;
});

module.exports = pool;
