require("dotenv").config();

const database = require("../../database");
const Student = require("../../models/Student");
const {
  TABLE_STUDENTS,
  TABLE_TEACHERS,
  TABLE_TEACHERS_STUDENTS
} = require("../../constants");

const pool = database.connect();

describe("Student model test", () => {
  const allStudents = [];
  const studentJon = "studentjon@email.com";
  const studentHon = "studenthon@email.com";
  const studentBob = "studentbob@email.com";
  const unregisteredUser = "unregistered@email.com";

  beforeAll(async () => {
    await database.dropTable(pool, TABLE_TEACHERS_STUDENTS);
    await database.dropTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_STUDENTS);
    await Student.insert(pool, studentBob);
    await Student.insert(pool, studentHon);
    await Student.insert(pool, studentJon);
    allStudents.push(...(await Student.getAll(pool)));
  });
  afterAll(async () => {
    await database.dropTable(pool, TABLE_TEACHERS_STUDENTS);
    await database.dropTable(pool, TABLE_STUDENTS);
    await database.dropTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_STUDENTS);
    await database.initTable(pool, TABLE_TEACHERS);
    await database.initTable(pool, TABLE_TEACHERS_STUDENTS);
  });
  test(`Initial ${TABLE_STUDENTS} should be have 3 preloaded students`, async () => {
    expect(allStudents.length).toBe(3);
  });
  test("getIdByEmail should return id of student", async () => {
    const student1 = allStudents[0];
    const id = await Student.getIdByEmail(pool, student1.email);
    expect(id).toBe(student1.id);
  });
  test("getIdByEmail should return -1 for unregistered user", async () => {
    const id = await Student.getIdByEmail(pool, unregisteredUser);
    expect(id).toBe(-1);
  });
  test("getEmailById should return email of student", async () => {
    const student1 = allStudents[0];
    const email = await Student.getEmailById(pool, student1.id);
    expect(email).toBe(student1.email);
  });
  test("getEmailById should return null for unregisterd user", async () => {
    const email = await Student.getEmailById(pool, unregisteredUser);
    expect(email).toBe(null);
  });
});
