const database = require("../database");
const { TABLE_TEACHERS_STUDENTS } = require("../constants");

exports.insert = async (idTeacher, idStudent) =>
  await database.insertTeacherStudent(
    TABLE_TEACHERS_STUDENTS,
    idTeacher,
    idStudent
  );

exports.getAll = async () => {
  const queryStr = `SELECT * from ${TABLE_TEACHERS_STUDENTS}`;
  return await database.query(queryStr);
};
