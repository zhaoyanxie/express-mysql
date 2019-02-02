require("dotenv").config();

const database = require("../../database");
const Student = require("../../models/Student");
const { TABLE_STUDENTS } = require("../../constants");

const pool = database.connect();

describe("Student model test", () => {
  const allStudents = [];
  const studentJon = "studentjon@email.com";
  const studentHon = "studenthon@email.com";
  const studentBob = "studentbob@email.com";

  beforeAll(async () => {
    await Student.init(pool);
    allStudents.push(...(await Student.getAll(pool)));
  });

  test(`Initial ${TABLE_STUDENTS} should be empty`, async () => {
    expect(allStudents.length).toBe(0);
  });
  test("getAll should return all preloaded students", async () => {
    await Student.insert(pool, studentJon);
    await Student.insert(pool, studentHon);
    await Student.insert(pool, studentBob);
    allStudents.push(...(await Student.getAll(pool)));
    expect(allStudents.length).toBe(3);
  });
  test("getIdByEmail should return id of student", async () => {
    const student1 = allStudents[0];
    const id = await Student.getIdByEmail(student1.email);
    expect(id).toBe(student1.id);
  });
  test("getEmailById should return email of student", async () => {
    const student1 = allStudents[0];
    const email = await Student.getEmailById(student1.id);
    expect(email).toBe(student1.email);
  });
});
