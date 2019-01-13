require("dotenv").config();

const request = require("supertest");
const app = require("../index");

const apiController = require("../controllers/apiController");

describe("api router test", () => {
  test("POST /api/register to return status 400", async () => {
    const req = {
      teacher: "doesnotexist@email.com",
      students: ["studentjon@example.com", "studenthon@example.com"]
    };
    const res = await request(app)
      .post("/api/register")
      .send(req);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Teacher doesnotexist@email.com does not exist."
    );
  });
  test("POST /api/register to register a student (unregistered in database) to return status 204", async () => {
    const req = {
      teacher: "teacherjim@email.com",
      students: ["newstudent@email.com", "studentOnlyJim@email.com"]
    };
    const teacherJimIndex = await apiController.getTeacherIndex(req.teacher);
    const res = await request(app)
      .post("/api/register")
      .send(req);
    const resStudents = await request(app).get("/api/students");
    const newStudent = resStudents.body.filter(s =>
      s.email.includes("newstudent")
    )[0];
    expect(res.status).toBe(204);
    expect(newStudent.email).toBe(req.students[0]);
    expect(newStudent.teachers_id.includes(teacherJimIndex.toString())).toBe(
      true
    );
  });
  test("POST /api/register to update a registered student's teachers_id to return status 204", async () => {
    const req = {
      teacher: "teacherken@email.com",
      students: ["newstudent@email.com"]
    };
    const teacherKenIndex = await apiController.getTeacherIndex(req.teacher);
    const teacherJimIndex = await apiController.getTeacherIndex(
      "teacherjim@email.com"
    );
    const res = await request(app)
      .post("/api/register")
      .send(req);
    const resStudents = await request(app).get("/api/students");
    const newStudent = resStudents.body.filter(s =>
      s.email.includes("newstudent")
    )[0];
    expect(res.status).toBe(204);
    expect(newStudent.teachers_id.includes(teacherJimIndex.toString())).toBe(
      true
    );
    expect(newStudent.teachers_id.includes(teacherKenIndex.toString())).toBe(
      true
    );
  });
  test("GET /api/commonstudents to return 'newstudent@email.com' for Teachers Ken and Jim", async () => {
    const query = {
      teacher: ["teacherken@email.com", "teacherjim@email.com"]
    };
    const res = await request(app)
      .get("/api/commonstudents")
      .query(query);
    const commonStudents = res.body.students;
    expect(commonStudents).toHaveLength(1);
    expect(commonStudents[0].includes("newstudent")).toBe(true);
  });
});
