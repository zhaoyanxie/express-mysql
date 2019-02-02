const database = require("../database");

const pool = database.connect();

exports.getIdByEmail = async (table, findPerson) => {
  const queryStr = `SELECT id FROM ${table} WHERE email='${findPerson}'`;
  const response = await database.query(pool, queryStr);
  if (response.length === 0) return -1;
  return response[0].id;
};

exports.getEmailById = async (table, findById) => {
  const queryStr = `SELECT * FROM ${table} WHERE id='${findById}'`;
  const response = await database.query(pool, queryStr);
  if (response.length === 0) return -1;
  return response[0].email;
};
