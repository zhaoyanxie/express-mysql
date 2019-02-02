const mysql = require("promise-mysql");

const {
  TABLE_STUDENTS,
  TABLE_TEACHERS,
  TABLE_TEACHERS_STUDENTS
} = require("./constants");

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
  insert: async (pool, table, email) => {
    const queryStr = `INSERT IGNORE INTO ${table}(email) VALUES ('${email}')`;
    return await pool.query(queryStr);
  },
  insertTeacherStudent: async (pool, table, teacher_id, student_id) => {
    const queryStr = `INSERT IGNORE INTO ${table}(teacher_id, student_id) VALUES (${teacher_id}, ${student_id})`;
    return await pool.query(queryStr);
  },
  query: async (pool, queryStr) => {
    const results = await pool.query(queryStr);
    return results;
  },
  dropTable: async (pool, table) => {
    const queryStr = `DROP TABLE IF EXISTS ${table}`;
    await pool.query(queryStr);
  },
  initTable: async (pool, table) => {
    let queryStr = "";
    if (table === TABLE_STUDENTS)
      queryStr = `CREATE TABLE ${TABLE_STUDENTS} (
        id int(11) NOT NULL AUTO_INCREMENT,
        email varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
        is_suspended int(11) NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        UNIQUE KEY email_UNIQUE (email)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`;
    if (table === TABLE_TEACHERS)
      queryStr = `CREATE TABLE ${TABLE_TEACHERS} (
        id int(11) NOT NULL AUTO_INCREMENT,
        email varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
        is_suspended int(11) NOT NULL DEFAULT 0,
        PRIMARY KEY (id),
        UNIQUE KEY email_UNIQUE (email)
      ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`;
    if (table === TABLE_TEACHERS_STUDENTS)
      queryStr = `CREATE TABLE ${TABLE_TEACHERS_STUDENTS} (
          student_id int(11) NOT NULL,
          teacher_id int(11) NOT NULL,
          PRIMARY KEY (student_id, teacher_id),
          CONSTRAINT student_id FOREIGN KEY (student_id) REFERENCES tbl_students (id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT teacher_id FOREIGN KEY (teacher_id) REFERENCES tbl_teachers (id) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
        `;
    await pool.query(queryStr);
  }
};

module.exports = database;
