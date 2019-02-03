require("dotenv").config();

const { Teacher } = require("../../models");

describe("Teacher model test", () => {
  const allTeachers = [];
  const unregisteredUser = "unregistered@email.com";

  beforeAll(async () => {
    allTeachers.push(...(await Teacher.getAll()));
  });

  test("getAll should return all preloaded teachers", async () => {
    expect(allTeachers.length).toBeGreaterThanOrEqual(2);
  });
  test("getIdByEmail should return id of teacher", async () => {
    const teacher1 = allTeachers[0];
    const id = await Teacher.getIdByEmail(teacher1.email);
    expect(id).toBe(teacher1.id);
  });
  test("getIdByEmail should return -1 for unregistered user", async () => {
    const id = await Teacher.getIdByEmail(unregisteredUser);
    expect(id).toBe(-1);
  });
  test("getEmailById should return email of teacher", async () => {
    const teacher1 = allTeachers[0];
    const email = await Teacher.getEmailById(teacher1.id);
    expect(email).toBe(teacher1.email);
  });
  test("getEmailById should return null for unregisterd user", async () => {
    const email = await Teacher.getEmailById(unregisteredUser);
    expect(email).toBe(null);
  });
});
