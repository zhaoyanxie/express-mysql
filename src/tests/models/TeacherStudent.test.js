require("dotenv").config();

const { TeacherStudent } = require("../../models");
const {
  TEACHERS,
  STUDENTS,
  TABLE_TEACHERS_STUDENTS
} = require("../../constants");

describe("TeacherStudent model test", () => {
  const allEntries = [];

  beforeAll(async () => {
    allEntries.push(...(await TeacherStudent.getAll()));
  });
  test(`${TABLE_TEACHERS_STUDENTS} getAll should return length 4 after insert`, async () => {
    expect(allEntries.length).toBeGreaterThanOrEqual(4);
  });

  test("getCommonStudents should return ", async () => {
    const teacherEmailArr = [TEACHERS[0].email, TEACHERS[1].email];
    const commonStudents = await TeacherStudent.getCommonStudents(
      teacherEmailArr
    );
    expect(
      commonStudents.find(student =>
        student.email.includes(STUDENTS[1].email >= 0)
      )
    ).toBeTruthy;
  });
});
