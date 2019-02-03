require("dotenv").config();

const { Teacher, Student, TeacherStudent } = require("../../models");
const {
  TABLE_TEACHERS,
  TABLE_STUDENTS,
  TABLE_TEACHERS_STUDENTS
} = require("../../constants");

describe("TeacherStudent model test", () => {
  const allEntries = [];

  beforeAll(async () => {
    allEntries.push(...(await TeacherStudent.getAll()));
  });
  test(`${TABLE_TEACHERS_STUDENTS} getAll should return length 4 after insert`, async () => {
    expect(allEntries.length).toBe(4);
  });
});
