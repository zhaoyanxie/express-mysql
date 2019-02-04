const database = require("../database");
const { TABLE_STUDENTS } = require("../constants");
const { getIdByEmail, getEmailById } = require("../utils");

exports.insert = async studentEmail => {
  return await database.insert(TABLE_STUDENTS, studentEmail);
};

exports.getAll = async () => {
  const queryStr = `SELECT * from ${TABLE_STUDENTS}`;
  return await database.query(queryStr);
};

exports.getIdByEmail = async getStudent => {
  const id = await getIdByEmail(TABLE_STUDENTS, getStudent);
  return id;
};

exports.getEmailById = async getStudent => {
  const email = await getEmailById(TABLE_STUDENTS, getStudent);
  return email === null ? null : email;
};

exports.suspend = async studentEmail => {
  await database.update(
    TABLE_STUDENTS,
    "is_suspended",
    1,
    "email",
    studentEmail
  );

  exports.getStudentByEmail = async studentEmail => {
    const queryStr = `SELECT * FROM ${TABLE_STUDENTS} WHERE email = '${studentEmail}'`;
    return await database.query(queryStr);
  };
};
