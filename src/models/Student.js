const database = require("../database");
const { TABLE_STUDENTS, TABLE_TEACHERS_STUDENTS } = require("../constants");
const { getIdByEmail, getEmailById } = require("../utils");

exports.insert = async studentEmail =>
  await database.insert(TABLE_STUDENTS, studentEmail);

exports.getAll = async () => {
  const queryStr = `SELECT * from ${TABLE_STUDENTS}`;
  return await database.query(queryStr);
};

exports.getIdByEmail = async getStudent => {
  const id = await getIdByEmail(TABLE_STUDENTS, getStudent);
  return !id ? -1 : id;
};

exports.getEmailById = async getStudent => {
  const email = await getEmailById(TABLE_STUDENTS, getStudent);
  return email === null ? null : email;
};
