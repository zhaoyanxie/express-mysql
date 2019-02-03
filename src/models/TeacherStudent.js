const database = require("../database");
const { TABLE_STUDENTS, TABLE_TEACHERS_STUDENTS } = require("../constants");
const { Teacher } = require("../models");

exports.insert = async (idTeacher, idStudent) => {
  return await database.insertTeacherStudent(
    TABLE_TEACHERS_STUDENTS,
    idTeacher,
    idStudent
  );
};
exports.getAll = async () => {
  const queryStr = `SELECT * from ${TABLE_TEACHERS_STUDENTS}`;
  return await database.query(queryStr);
};

const commonStudentsQuery = indexesTeachers => {
  let querySelect = `SELECT DISTINCT email FROM ${TABLE_STUDENTS} t `;
  let queryInnerJoin = `INNER JOIN ${TABLE_TEACHERS_STUDENTS} t0 ON t.id = t0.student_id `;
  let queryWhere = `WHERE t0.teacher_id = ${indexesTeachers[0]} `;

  indexesTeachers.forEach((indexTeacher, i) => {
    if (i > 0) {
      queryInnerJoin += `INNER JOIN ${TABLE_TEACHERS_STUDENTS} t${i} ON t.id = t${i}.student_id `;
      queryWhere += `AND t${i}.teacher_id = ${indexTeacher} `;
    }
  });
  return querySelect + queryInnerJoin + queryWhere;
};

exports.getCommonStudents = async teachersEmailArr => {
  const indexesTeachers = await Promise.all(
    teachersEmailArr.map(async teacher => await Teacher.getIdByEmail(teacher))
  );
  const response = await database.query(commonStudentsQuery(indexesTeachers));
  const responseStudents = response.map(resObj => Object.values(resObj)[0]);
  return responseStudents;
};
