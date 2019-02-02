require("dotenv").config();
const express = require("express");

const apiController = require("../../controllers/apiController");
const {
  TABLE_STUDENTS,
  TABLE_TEACHERS,
  TABLE_TEACHERS_STUDENTS
} = require("../../constants");

describe("apiController test", () => {
  test("getAllTeachers returns the three teachers in test database.", async () => {
    const allTeachers = await apiController.getAllTeachers();
    expect(allTeachers.length).toBeGreaterThanOrEqual(3);
  });
  test("getIndex returns the index of a teacher", async () => {
    const allTeachers = await apiController.getAllTeachers();
    const teacher0email = allTeachers[0].email;
    const response = await apiController.getIndex(
      TABLE_TEACHERS,
      teacher0email
    );
    expect(response).toBe(1);
  });
  test("getIndex returns -1 for unknown teacher", async () => {
    const response = await apiController.getIndex(
      TABLE_TEACHERS,
      "doesnotexist@email.com"
    );
    expect(response).toBe(-1);
  });

  test("getById returns the email of a person", async () => {
    // TODO: implement drop table
    const queryTeacher = await apiController.getById(TABLE_TEACHERS, 1);
    expect(queryTeacher.email).toBe("teacherken@email.com");
  });

  test.skip("getAllStudents returns the students preloaded in test database.", async () => {
    const allStudents = await apiController.getAllStudents();
    expect(allStudents.length).toBeGreaterThan(0);
  });

  test.skip("getStudentsTeacherId should return the indexes of associated teachers of a student", async () => {
    const allStudents = await apiController.getAllStudents();
    const student2 = allStudents[2];
    const response = await apiController.getStudentsTeacherId(
      student2.student_email
    );
    expect(response[0].teacher_id).toBe(2);
  });
});
