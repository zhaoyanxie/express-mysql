require("dotenv").config();

const express = require("express");

const apiController = require("../../controllers/apiController");
const {
  TABLE_STUDENTS,
  TABLE_TEACHERS,
  STUDENTS_COL_TEACHERS_ID
} = require("../../constants");

const app = express();

describe("apiController test", () => {
  test("getAllTeachers returns the three teachers in test database.", async () => {
    const allTeachers = await apiController.getAllTeachers();
    expect(allTeachers).toHaveLength(3);
  });
  test("getStudentIndex should return the index of a teacher", async () => {
    const allTeachers = await apiController.getAllTeachers();
    const teacher0email = allTeachers[0].email;
    const response = await apiController.getTeacherIndex(teacher0email);
    expect(response).toBe(0);
  });
  test("getAllStudents returns the students preloaded in test database.", async () => {
    const allStudents = await apiController.getAllStudents();
    expect(allStudents.length).toBeGreaterThan(0);
  });
  test("getStudentIndex should return the index of a student", async () => {
    const allStudents = await apiController.getAllStudents();
    const student0email = allStudents[0].email;
    const response = await apiController.getStudentIndex(student0email);
    expect(response).toBe(0);
  });
});
