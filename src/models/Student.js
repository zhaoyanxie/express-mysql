const database = require("../database");
const { TABLE_STUDENTS } = require("../constants");
const { getIdByEmail, getEmailById } = require("../utils");

const pool = database.connect();

exports.init = async pool => {
  try {
    await database.dropTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_STUDENTS);
  } catch (e) {
    throw e;
  }
};
exports.insert = async (pool, studentEmail) =>
  await database.insert(pool, TABLE_STUDENTS, studentEmail);

exports.getAll = async () => {
  const queryStr = `SELECT * from ${TABLE_STUDENTS}`;
  return await database.query(pool, queryStr);
};

exports.getIdByEmail = async getStudent => {
  const id = await getIdByEmail(TABLE_STUDENTS, getStudent);
  if (!id) return -1;
  return id;
};

exports.getEmailById = async getStudent => {
  const email = await getEmailById(TABLE_STUDENTS, getStudent);
  if (!email) return -1;
  return email;
};
