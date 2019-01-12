const mysql = require("promise-mysql");

const { SCHEMA } = require("./constants");

const database = {
  connect: () => {
    // connect to db
    const pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "password",
      database: SCHEMA
    });
    pool.getConnection((error, connection) => {
      if (error) throw error;
      if (connection) {
        console.log("Database 'school' connected");
        connection.release();
        return;
      }
    });
    return pool;
  },
  insert: async (pool, table, email) => {
    try {
      console.log("here", `INSERT INTO ${table} (email) VALUES ('${email}')`);
      return await pool.query(
        `INSERT INTO ${table} (email) VALUES ('${email}')`
      );
    } catch (error) {
      throw error;
    }
  },
  query: async (pool, queryStr) => {
    const results = await pool.query(queryStr);
    return results;
  }
};

module.exports = database;
