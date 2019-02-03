require("dotenv").config();

const database = require("../../database");
const { Teacher, Student, TeacherStudent } = require("../../models");
const {
  TABLE_TEACHERS,
  TABLE_STUDENTS,
  TABLE_TEACHERS_STUDENTS
} = require("../../constants");

const pool = database.connect();

describe("TeacherStudent model test", () => {
  const allEntries = [];
  const teachers = [
    { email: "teacherken@email.com" },
    { email: "teacherjim@email.com" }
  ];
  const students = [
    { email: "studentOnlyKen@email.com" },
    { email: "studentKenAndJim@email.com" },
    { email: "studentOnlyJim@email.com" }
  ];

  beforeAll(async () => {
    await database.dropTable(pool, TABLE_TEACHERS_STUDENTS);
    await database.dropTable(pool, TABLE_TEACHERS);
    await database.dropTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS_STUDENTS);
    // Insert into Teacher and Student
    await teachers.forEach(async t => await Teacher.insert(pool, t.email));
    await students.forEach(async s => await Student.insert(pool, s.email));
    // Get ids
    const idTeacherKen = await Teacher.getIdByEmail(pool, teachers[0].email);
    const idTeacherJim = await Teacher.getIdByEmail(pool, teachers[1].email);
    const idStudentOnlyKen = await Student.getIdByEmail(
      pool,
      students[0].email
    );
    const idStudentKenAndJim = await Student.getIdByEmail(
      pool,
      students[1].email
    );
    const idStudentOnlyJim = await Student.getIdByEmail(
      pool,
      students[2].email
    );
    teachers.forEach(
      t => (t.id = t.email === teachers[0].email ? idTeacherKen : idTeacherJim)
    );
    students.forEach((s, i) => {
      if (i === 0) s.id = idStudentOnlyKen;
      else if (i === 1) s.id = idStudentKenAndJim;
      else if (i === 2) s.id = idStudentOnlyJim;
    });
  });
  afterAll(async () => {
    await database.dropTable(pool, TABLE_TEACHERS_STUDENTS);
    await database.dropTable(pool, TABLE_STUDENTS);
    await database.dropTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_TEACHERS_STUDENTS);
  });
  test(`Initial ${TABLE_TEACHERS_STUDENTS} should be empty`, async () => {
    const allTeacherStudent = await TeacherStudent.getAll(pool);
    expect(allTeacherStudent.length).toBe(0);
  });
  test(`${TABLE_TEACHERS_STUDENTS} getAll should return length 4 after insert`, async () => {
    await TeacherStudent.insert(pool, teachers[0].id, students[0].id);
    await TeacherStudent.insert(pool, teachers[0].id, students[1].id);
    await TeacherStudent.insert(pool, teachers[1].id, students[1].id);
    await TeacherStudent.insert(pool, teachers[1].id, students[2].id);
    allEntries.push(...(await TeacherStudent.getAll(pool)));
    expect(allEntries.length).toBe(4);
  });
});
