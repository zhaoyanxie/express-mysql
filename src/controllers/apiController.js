const mysql = require("../database");
const connection = mysql.connect();

// GET all teachers
const teachers = (req, res, next) => {
  const queryStr = `SELECT * from teachers`;
  connection.query(queryStr, (error, results, fields) => {
    if (error) throw error;
    return res.status(200).json(results);
  });
};

// Register a student to a teacher
const register = (req, res, next) => {
  const { email } = req.body;
  const queryStr = `INSERT INTO students ("email") VALUES (${email})`;
  // connection.query();
  console.log(req);
  // Check if teacher exists
  // Insert students into table
  // Join students to teacher
  res.json({ message: "register" });
};

// Join students to a common teacher
const commonStudents = (req, res, next) => {
  const store = mysql.connect();
};
module.exports = { register, commonStudents, teachers };
