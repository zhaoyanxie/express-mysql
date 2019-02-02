require("dotenv").config();

const database = require("../../database");
const TeacherStudent = require("../../models/TeacherStudent");
const Teacher = require("../../models/Teacher");
const {
  TABLE_TEACHERS,
  TABLE_STUDENTS,
  TABLE_TEACHERS_STUDENTS
} = require("../../constants");
const pool = database.connect();

describe("TeacherStudent model test", () => {
  const allEntries = [];
  const teacherKen = "teacherken@email.com";
  const teacherJim = "teacherjim@email.com";
  const teacherJoe = "teacherjoe@email.com";

  beforeAll(async () => {
    // await TeacherStudent.init(pool);
    await database.dropTable(pool, TABLE_TEACHERS_STUDENTS);
    await database.dropTable(pool, TABLE_TEACHERS);
    await database.dropTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS_STUDENTS);
    allEntries.push(...(await TeacherStudent.getAll(pool)));
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
    expect(allEntries.length).toBe(0);
  });
});
