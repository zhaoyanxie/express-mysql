const database = require("../database");
const { TABLE_TEACHERS_STUDENTS } = require("../constants");

exports.insert = async (pool, idTeacher, idStudent) =>
  await database.insertTeacherStudent(
    pool,
    TABLE_TEACHERS_STUDENTS,
    idTeacher,
    idStudent
  );

exports.getAll = async pool => {
  const queryStr = `SELECT * from ${TABLE_TEACHERS_STUDENTS}`;
  return await database.query(pool, queryStr);
};
