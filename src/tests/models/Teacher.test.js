require("dotenv").config();

const database = require("../../database");
const Teacher = require("../../models/Teacher");
const {
  TABLE_TEACHERS,
  TABLE_STUDENTS,
  TABLE_TEACHERS_STUDENTS
} = require("../../constants");

const pool = database.connect();

describe("Teacher model test", () => {
  const allTeachers = [];
  const teacherKen = "teacherken@email.com";
  const teacherJim = "teacherjim@email.com";
  const teacherJoe = "teacherjoe@email.com";

  beforeAll(async () => {
    // await Teacher.init(pool);
    await database.dropTable(pool, TABLE_TEACHERS_STUDENTS);
    await database.dropTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_TEACHERS);
    allTeachers.push(...(await Teacher.getAll(pool)));
  });
  afterAll(async () => {
    await database.dropTable(pool, TABLE_TEACHERS_STUDENTS);
    await database.dropTable(pool, TABLE_STUDENTS);
    await database.dropTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_TEACHERS_STUDENTS);
  });
  test(`Initial ${TABLE_TEACHERS} should be empty`, async () => {
    expect(allTeachers.length).toBe(0);
  });
  test("getAll should return all preloaded teachers", async () => {
    await Teacher.insert(pool, teacherJim);
    await Teacher.insert(pool, teacherJoe);
    await Teacher.insert(pool, teacherKen);
    allTeachers.push(...(await Teacher.getAll(pool)));
    expect(allTeachers.length).toBe(3);
  });
  test("getIdByEmail should return id of teacher", async () => {
    const teacher1 = allTeachers[0];
    const id = await Teacher.getIdByEmail(teacher1.email);
    expect(id).toBe(teacher1.id);
  });
  test("getEmailById should return email of teacher", async () => {
    const teacher1 = allTeachers[0];
    const email = await Teacher.getEmailById(teacher1.id);
    expect(email).toBe(teacher1.email);
  });
});
