require("dotenv").config();
const database = require("./database");

const {
  TABLE_TEACHERS,
  TABLE_STUDENTS,
  TABLE_TEACHERS_STUDENTS
} = require("./constants");
const { Teacher, Student, TeacherStudent } = require("./models");

const TEACHERS = [
  { email: "teacherken@email.com" },
  { email: "teacherjim@email.com" }
];

const STUDENTS = [
  { email: "studentOnlyKen@email.com" },
  { email: "studentKenAndJim@email.com" },
  { email: "studentOnlyJim@email.com" }
];

const asyncForEach = async (arr, cb) => {
  for (let index = 0; index < arr.length; index++) {
    await cb(arr[index], index, arr);
  }
};
const setupTestDB = async () => {
  await database.dropTable(TABLE_TEACHERS_STUDENTS);
  await database.dropTable(TABLE_TEACHERS);
  await database.dropTable(TABLE_STUDENTS);
  await database.initTable(TABLE_TEACHERS);
  await database.initTable(TABLE_STUDENTS);
  await database.initTable(TABLE_TEACHERS_STUDENTS);

  await asyncForEach(TEACHERS, async t => {
    const response = await Teacher.insert(t.email);
    t.id = response.insertId; // get teacher id
  });
  await asyncForEach(STUDENTS, async s => {
    const response = await Student.insert(s.email);
    s.id = response.insertId; // get student id
  });
  await TeacherStudent.insert(TEACHERS[0].id, STUDENTS[0].id);
  await TeacherStudent.insert(TEACHERS[0].id, STUDENTS[1].id);
  await TeacherStudent.insert(TEACHERS[1].id, STUDENTS[1].id);
  await TeacherStudent.insert(TEACHERS[1].id, STUDENTS[2].id);
};

module.exports = setupTestDB;
