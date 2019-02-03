const database = require("../database");
const { TABLE_TEACHERS } = require("../constants");
const { getIdByEmail, getEmailById } = require("../utils");

exports.insert = async teacherEmail =>
  await database.insert(TABLE_TEACHERS, teacherEmail);

exports.getAll = async () => {
  const queryStr = `SELECT * from ${TABLE_TEACHERS}`;
  return await database.query(queryStr);
};

exports.getIdByEmail = async getTeacher => {
  const id = await getIdByEmail(TABLE_TEACHERS, getTeacher);
  return id;
};

exports.getEmailById = async getTeacher => {
  const email = await getEmailById(TABLE_TEACHERS, getTeacher);
  return email === null ? null : email;
};
