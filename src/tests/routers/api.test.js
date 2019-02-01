require("dotenv").config();

const express = require("express");
const request = require("supertest");

const apiRouter = require("../../routers/api");
const apiController = require("../../controllers/apiController");
const {
  TABLE_STUDENTS,
  TABLE_TEACHERS,
  TABLE_TEACHERS_STUDENTS
} = require("../../constants");

const app = express();

apiRouter(app);
describe("api router test", () => {
  const userDoesNotExist = "doesnotexist@email.com";
  const studentHon = "studenthon@example.com";
  const studentJon = "studentjon@example.com";
  const teacherJim = "teacherjim@email.com";
  const teacherKen = "teacherken@email.com";
  const teacherJoe = "teacherjoe@email.com";

  test("POST /api/register to return status 400", async () => {
    const req = {
      teacher: userDoesNotExist,
      students: [studentJon, studentHon]
    };
    const res = await request(app)
      .post("/api/register")
      .send(req);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      `Teacher ${userDoesNotExist} does not exist.`
    );
  });
  test.skip("POST /api/register to register a student (unregistered in database) to return status 204", async () => {
    const req = {
      teacher: teacherJim,
      students: ["newstudent@email.com", "studentOnlyJim@email.com"]
    };
    const teacherJimIndex = await apiController.getIndex(
      TABLE_TEACHERS,
      req.teacher
    );
    const res = await request(app)
      .post("/api/register")
      .send(req);
    const resStudents = await request(app).get("/api/students");
    const newStudent = resStudents.body.filter(s =>
      s.student_email.includes("newstudent")
    )[0];
    expect(res.status).toBe(204);
    expect(newStudent.email).toBe(req.students[0]);
    // expect(newStudent.teacher_id).toBe(teacherJimIndex);
  });
  test.skip("POST /api/register to update a registered student's teachers_id to return status 204", async () => {
    const req = {
      teacher: teacherKen,
      students: ["newstudent@email.com"]
    };
    const teacherKenIndex = await apiController.getIndex(
      TABLE_TEACHERS,
      req.teacher
    );
    const teacherJimIndex = await apiController.getIndex(
      TABLE_TEACHERS,
      teacherJim
    );
    const res = await request(app)
      .post("/api/register")
      .send(req);
    const newStudentTeachers = await apiController.getStudentsTeacherId(
      req.students[0]
    );
    const newStudentTeachersValues = newStudentTeachers
      .map(arr => arr.teacher_id)
      .sort((a, b) => a - b);
    expect(res.status).toBe(204);
    expect(newStudentTeachers).toHaveLength(2);
    expect(newStudentTeachersValues).toEqual(
      [teacherKenIndex, teacherJimIndex].sort((a, b) => a - b)
    );
  });

  test.only("GET /api/commonstudents to return 'newstudent@email.com' for Teachers Ken and Jim", async () => {
    const query = {
      teacher: [teacherKen, teacherJoe]
    };
    const res = await request(app)
      .get("/api/commonStudents")
      .query(query);
    const commonStudents = res.body.students;
    expect(commonStudents[0].includes("newstudent")).toBe(true);
  });
  test.skip("POST /api/suspend to suspend a student and return status 204", async () => {
    const reqRegister = {
      teacher: teacherKen,
      students: ["suspendedstudent@email.com"]
    };
    const reqSuspend = {
      student: "suspendedstudent@email.com"
    };
    await request(app)
      .post("/api/register")
      .send(reqRegister);
    const res = await request(app)
      .post("/api/suspend")
      .send(reqSuspend);
    const resStudents = await request(app).get("/api/students");
    const suspendedStudent = resStudents.body.filter(s =>
      s.email.includes("suspendedstudent")
    )[0];
    expect(res.status).toBe(204);
    expect(suspendedStudent.isSuspended).toBe(1);
  });
  test.skip("POST /api/suspend to suspend a student and return status 400 when student not found", async () => {
    const reqSuspend = {
      student: userDoesNotExist
    };
    const res = await request(app)
      .post("/api/suspend")
      .send(reqSuspend);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(`Student ${userDoesNotExist} does not exist`);
  });
  test.skip("POST /api/retrievefornotifications to return status 400 for teacher does not exist", async () => {
    const req = {
      teacher: userDoesNotExist,
      notification:
        "Hello students! @studentagnes@example.com @studentmiche@example.com"
    };
    const res = await request(app)
      .post("/api/retrievefornotifications")
      .send(req);
    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(
      `Teacher ${userDoesNotExist} does not exist.`
    );
  });
  test.skip("POST /api/retrievefornotifications to return list of students for notification", async () => {
    const req = {
      teacher: teacherKen,
      notification:
        "Hello students! @studentagnes@example.com @studentmiche@example.com"
    };
    const res = await request(app)
      .post("/api/retrievefornotifications")
      .send(req);
    const expectedNotificationList = [
      "studentagnes@example.com",
      "newstudent@email.com",
      "studentmiche@example.com"
    ];
    expect(res.status).toBe(200);
    expect(res.body.recipients.sort()).toEqual(expectedNotificationList.sort());
  });
});
