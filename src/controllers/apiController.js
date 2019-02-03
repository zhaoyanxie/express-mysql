const database = require("../database");
const { asyncForEach } = require("../utils/asyncForEach");
const {
  TABLE_STUDENTS,
  TABLE_TEACHERS,
  TABLE_TEACHERS_STUDENTS
} = require("../constants");
const { Teacher, Student, TeacherStudent } = require("../models");

const teachers = async (req, res, next) => {
  const allTeachers = await Teacher.getAll();
  res.status(200).json(allTeachers);
};

const students = async (req, res, next) => {
  const allStudents = await Student.getAll();
  res.status(200).json(allStudents);
};

// ERROR-HANDLING:
const checkTeacherExist = (res, next, indexTeacher, teacherEmail) => {
  if (indexTeacher < 0) {
    return res
      .status(400)
      .json({ message: `Teacher ${teacherEmail} does not exist.` });
  }
  next();
};

const register = async (req, res, next) => {
  const { body } = req;
  const { teacher, students } = body;
  let idStudent;
  const idTeacher = await Teacher.getIdByEmail(teacher); // from db
  checkTeacherExist(res, next, idTeacher, teacher);

  asyncForEach(students, async student => {
    idStudent = await Student.getIdByEmail(student);

    if (idStudent < 0) {
      await Student.insert(student);
      idStudent = await Student.getIdByEmail(student);
    }
    await TeacherStudent.insert(idTeacher, idStudent);
  });

  return res.status(201).json({ message: "registered" });
};

const commonStudents = async (req, res, next) => {
  let queryTeachers = req.query.teacher;
  queryTeachers =
    queryTeachers.constructor === Array ? queryTeachers : [queryTeachers];
  const commonStudents = await TeacherStudent.getCommonStudents(queryTeachers);
  return res.json({ students: commonStudents });
};

const suspend = async (req, res, next) => {
  const studentToSuspend = req.body.student;
  // ERROR-HANDLING: check if student exists
  const indexStudent = await Student.getIdByEmail(studentToSuspend);
  if (indexStudent < 0)
    return res
      .status(400)
      .json({ message: `Student ${studentToSuspend} does not exist` });
  await Student.suspend(studentToSuspend);

  console.log(`Student ${studentToSuspend} suspended.`);
  res.status(204).json({ message: "suspend" });
};

// const retrievefornotifications = async (req, res, next) => {
//   const { teacher, notification } = req.body;
//   // Criteria 1: must not be suspended
//   const criteria1 = "isSuspended = 0";
//   const queryStr = `SELECT (email), (teachers_id) FROM ${TABLE_STUDENTS} WHERE ${criteria1}`;
//   const studentsNotSuspended = await database.query(queryStr);
//   // console.log("results", studentsNotSuspended);

//   // Criteria 2: registered with teacher OR mentioned notification
//   // filter out students registered with teacher
//   const teacherIndex = await getTeacherIndex(teacher);
//   // ERROR-HANDLING: Check if teacher exists, exit if doesn't
//   if (teacherIndex < 0) {
//     return res
//       .status(400)
//       .json({ message: `Teacher ${teacher} does not exist.` });
//   }
//   const notificationList = studentsNotSuspended
//     .filter(student => {
//       const teachers_id = student.teachers_id || "";
//       const teachers_idArr = teachers_id.split(",").map(id => parseInt(id));
//       return teachers_idArr.indexOf(teacherIndex) >= 0;
//     })
//     .map(student => student.email);

//   // add to to notification list those mentioned
//   const mentionedStudents = notification
//     .match(/(?=[\ @])[^\s]+/g)
//     .map(string => string.substr(1));
//   mentionedStudents.forEach(mentionedStudent => {
//     if (notificationList.indexOf(mentionedStudent) < 0) {
//       notificationList.push(mentionedStudent);
//     }
//   });
//   res.status(200).json({ recipients: notificationList });
// };
module.exports = {
  teachers,
  students,
  register,
  commonStudents,
  suspend
  // retrievefornotifications
};
