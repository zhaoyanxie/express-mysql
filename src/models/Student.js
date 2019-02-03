const database = require("../database");
const { TABLE_STUDENTS, TABLE_TEACHERS_STUDENTS } = require("../constants");
const { getIdByEmail, getEmailById } = require("../utils");

exports.insert = async (pool, studentEmail) =>
  await database.insert(pool, TABLE_STUDENTS, studentEmail);

exports.getAll = async pool => {
  const queryStr = `SELECT * from ${TABLE_STUDENTS}`;
  return await database.query(pool, queryStr);
};

exports.getIdByEmail = async (pool, getStudent) => {
  const id = await getIdByEmail(pool, TABLE_STUDENTS, getStudent);
  return !id ? -1 : id;
};

exports.getEmailById = async (pool, getStudent) => {
  const email = await getEmailById(pool, TABLE_STUDENTS, getStudent);
  return email === null ? null : email;
};
