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
const { Teacher, Student, TeacherStudent } = require("../../models");

const app = express();

apiRouter(app);
describe("api router test", () => {
  const userDoesNotExist = "doesnotexist@email.com";
  const studentA = "studentA@email.com";
  const studentB = "studentB@example.com";
  const teacherJim = "teacherjim@email.com";
  const teacherJoe = "teacherjoe@email.com";

  test("GET /api/teachers to return status 200", async () => {
    const res = await request(app).get("/api/teachers");
    expect(res.status).toBe(200);
  });
  test("GET /api/students to return status 200", async () => {
    const res = await request(app).get("/api/students");
    expect(res.status).toBe(200);
  });
  test.skip("POST /api/register to return status 400", async () => {
    const req = {
      teacher: userDoesNotExist,
      students: [studentB, studentA]
    };
    const res = await request(app)
      .post("/api/register")
      .send(req);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      `Teacher ${userDoesNotExist} does not exist.`
    );
  });

  test("POST /api/register to register a student (unregistered in database) to return status 204", async () => {
    const req = {
      teacher: teacherJim,
      students: ["newstudent@email.com", "studentnew@email.com"]
    };
    await request(app)
      .post("/api/register")
      .send(req);
    const idStudent1 = await Student.getIdByEmail(req.students[0]);
    const idStudent2 = await Student.getIdByEmail(req.students[1]);
    const idTeacherJim = await Teacher.getIdByEmail(req.teacherJim);
    const allTeacherStudent = await TeacherStudent.getAll();

    expect(
      allTeacherStudent.find(
        ele => ele.student_id === idStudent1 && ele.teacher_id === idTeacherJim
      )
    ).toBeTruthy;
    expect(
      allTeacherStudent.find(
        ele => ele.student_id === idStudent2 && ele.teacher_id === idTeacherJim
      )
    ).toBeTruthy;
  });

  test("GET /api/commonstudents to return 'newstudent@email.com' for Teachers Joe and Jim", async () => {
    const query = {
      teacher: [teacherJim, teacherJoe]
    };
    const reqRegister = {
      teacher: teacherJoe,
      students: ["newstudent@email.com"]
    };
    await request(app)
      .post("/api/register")
      .send(reqRegister);

    const res = await request(app)
      .get("/api/commonStudents")
      .query(query);
    const commonStudents = res.body.students;
    expect(commonStudents.indexOf(reqRegister.students[0])).toBeGreaterThan(-1);
  });

  test.skip("POST /api/suspend to suspend a student and return status 204", async () => {
    const reqRegister = {
      teacher: teacherJim,
      students: ["suspendedstudent@email.com"]
    };
    const reqSuspend = {
      student: "suspendedstudent@email.com"
    };
    let indexStudent = await Student.getIdByEmail(reqSuspend.student);
    // TODO: Remove if drop table is implemented
    if (indexStudent < 0)
      indexStudent = await request(app)
        .post("/api/register")
        .send(reqRegister);
    const res = await request(app)
      .post("/api/suspend")
      .send(reqSuspend);
    const queryStudent = await apiController.getById(
      TABLE_STUDENTS,
      indexStudent
    );
    expect(res.status).toBe(204);
    expect(queryStudent.is_suspended).toBe(1);
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
