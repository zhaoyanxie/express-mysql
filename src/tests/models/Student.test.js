require("dotenv").config();

const database = require("../../database");
const Student = require("../../models/Student");

const pool = database.connect();

describe("Student model test", () => {
  const allStudents = [];
  beforeAll(async () => {
    allStudents.push(...(await Student.getAll(pool)));
  });
  test("getAll should return all preloaded students", async () => {
    expect(allStudents.length).toBeGreaterThan(1);
  });
  test("getIdByEmail should return id of teacher", async () => {
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
