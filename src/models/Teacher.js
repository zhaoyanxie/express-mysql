const database = require("../database");
const { TABLE_TEACHERS, TABLE_TEACHERS_STUDENTS } = require("../constants");
const { getIdByEmail, getEmailById } = require("../utils");

exports.insert = async (pool, teacherEmail) =>
  await database.insert(pool, TABLE_TEACHERS, teacherEmail);

exports.getAll = async pool => {
  const queryStr = `SELECT * from ${TABLE_TEACHERS}`;
  return await database.query(pool, queryStr);
};

exports.getIdByEmail = async (pool, getTeacher) => {
  const id = await getIdByEmail(pool, TABLE_TEACHERS, getTeacher);
  return !id ? -1 : id;
};

exports.getEmailById = async (pool, getTeacher) => {
  const email = await getEmailById(pool, TABLE_TEACHERS, getTeacher);
  return email === null ? null : email;
};
