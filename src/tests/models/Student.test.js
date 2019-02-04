require("dotenv").config();

const Student = require("../../models/Student");
const { TABLE_STUDENTS } = require("../../constants");

describe("Student model test", () => {
  const allStudents = [];
  const unregisteredUser = "unregistered@email.com";

  beforeAll(async () => {
    allStudents.push(...(await Student.getAll()));
  });
  test(`Initial ${TABLE_STUDENTS} should be have 3 preloaded students`, async () => {
    expect(allStudents.length).toBeGreaterThanOrEqual(3);
  });
  test("getIdByEmail should return id of student", async () => {
    const student1 = allStudents[0];
    const id = await Student.getIdByEmail(student1.email);
    expect(id).toBe(student1.id);
  });
  test("getIdByEmail should return -1 for unregistered user", async () => {
    const id = await Student.getIdByEmail(unregisteredUser);
    expect(id).toBe(-1);
  });
  test("getEmailById should return email of student", async () => {
    const student1 = allStudents[0];
    const email = await Student.getEmailById(student1.id);
    expect(email).toBe(student1.email);
  });
  test("getEmailById should return null for unregisterd user", async () => {
    const email = await Student.getEmailById(unregisteredUser);
    expect(email).toBe(null);
  });
  test("suspend a student", async () => {
    const student1 = await Student.getEmailById(1);
    await Student.suspend(student1);
    const resStudent1 = await Student.getStudentByEmail(student1);
    expect(resStudent1[0].is_suspended).toBe(1);
  });
});
