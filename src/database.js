const mysql = require("promise-mysql");

const { NODE_ENV, PRODUCTION_DB, DEVELOPMENT_DB } = process.env;
const db = NODE_ENV === "production" ? PRODUCTION_DB : DEVELOPMENT_DB;

const database = {
  connect: () => {
    // connect to db
    const pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: "password",
      database: db
    });
    pool.getConnection((error, connection) => {
      if (error) throw error;
      if (connection) {
        console.log(`Database ${db} connected`);
        connection.release();
        return;
      }
    });
    return pool;
  },
  update: async (pool, table, column, value, condition, conditionValue) => {
    const queryStr = `UPDATE ${table} SET ${column} = '${value}' WHERE ${condition} = '${conditionValue}'`;
    return await pool.query(queryStr);
  },
  insert: async (pool, table, email, teachers_id) => {
    try {
      return await pool.query(
        `INSERT INTO ${table} (email, teachers_id) VALUES ('${email}', ${teachers_id})`
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
