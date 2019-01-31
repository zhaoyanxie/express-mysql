require("dotenv").config();
const express = require("express");

const apiController = require("../../controllers/apiController");

describe("apiController test", () => {
  test("getAllTeachers returns the three teachers in test database.", async () => {
    const allTeachers = await apiController.getAllTeachers();
    expect(allTeachers.length).toBeGreaterThanOrEqual(3);
  });
  test("getTeacherIndex returns the index of a teacher", async () => {
    const allTeachers = await apiController.getAllTeachers();
    const teacher0email = allTeachers[0].teacher_email;
    const response = await apiController.getTeacherIndex(teacher0email);
    expect(response).toBe(1);
  });
  test("getTeacherIndex returns -1 for unknown teacher", async () => {
    const response = await apiController.getTeacherIndex(
      "doesnotexist@email.com"
    );
    expect(response).toBe(-1);
  });
  test("getStudentIndex should return the index of a teacher", async () => {
    const allTeachers = await apiController.getAllTeachers();
    const teacher0email = allTeachers[0].teacher_email;
    const response = await apiController.getTeacherIndex(teacher0email);
    expect(response).toBe(1);
  });
  test("getAllStudents returns the students preloaded in test database.", async () => {
    const allStudents = await apiController.getAllStudents();
    expect(allStudents.length).toBeGreaterThan(0);
  });

  test("getStudentsTeacherId should return the indexes of associated teachers of a student", async () => {
    const allStudents = await apiController.getAllStudents();
    const student2 = allStudents[2];
    const response = await apiController.getStudentsTeacherId(
      student2.student_email
    );
    expect(response[0].teacher_id).toBe(2);
  });
});
