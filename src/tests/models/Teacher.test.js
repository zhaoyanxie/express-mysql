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
  const unregisteredUser = "unregistered@email.com";

  beforeAll(async () => {
    // await Teacher.init(pool);
    await database.dropTable(pool, TABLE_TEACHERS_STUDENTS);
    await database.dropTable(pool, TABLE_TEACHERS);
    await database.dropTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS_STUDENTS);
    await Teacher.insert(pool, teacherJim);
    await Teacher.insert(pool, teacherJoe);
    await Teacher.insert(pool, teacherKen);
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
  test("getAll should return all preloaded teachers", async () => {
    expect(allTeachers.length).toBe(3);
  });
  test("getIdByEmail should return id of teacher", async () => {
    const teacher1 = allTeachers[0];
    const id = await Teacher.getIdByEmail(pool, teacher1.email);
    expect(id).toBe(teacher1.id);
  });
  test("getIdByEmail should return -1 forunregistered user", async () => {
    const id = await Teacher.getIdByEmail(pool, unregisteredUser);
    expect(id).toBe(-1);
  });
  test("getEmailById should return email of teacher", async () => {
    const teacher1 = allTeachers[0];
    const email = await Teacher.getEmailById(pool, teacher1.id);
    expect(email).toBe(teacher1.email);
  });
  test("getEmailById should return null for unregisterd user", async () => {
    const email = await Teacher.getEmailById(pool, unregisteredUser);
    expect(email).toBe(null);
  });
});
