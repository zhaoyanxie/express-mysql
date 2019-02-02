require("dotenv").config();

const database = require("../../database");
const Teacher = require("../../models/Teacher");

const pool = database.connect();

describe("Teacher model test", () => {
  const allTeachers = [];
  beforeAll(async () => {
    allTeachers.push(...(await Teacher.getAll(pool)));
  });
  test("getAll should return all preloaded teachers", async () => {
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
