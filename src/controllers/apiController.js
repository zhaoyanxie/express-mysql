const { asyncForEach } = require("../utils/asyncForEach");
const { Teacher, Student, TeacherStudent } = require("../models");

const teachers = async (req, res, next) => {
  const allTeachers = await Teacher.getAll();
  res.status(200).json(allTeachers);
};

const students = async (req, res, next) => {
  const allStudents = await Student.getAll();
  res.status(200).json(allStudents);
};

const register = async (req, res, next) => {
  try {
    const { body } = req;
    const { teacher, students } = body;
    let idStudent;
    const idTeacher = await Teacher.getIdByEmail(teacher); // from db

    if (idTeacher < 0) {
      const error = new Error(`Teacher ${teacher} does not exist.`);
      error.name = "UserError";
      return next(error);
    }

    asyncForEach(students, async student => {
      idStudent = await Student.getIdByEmail(student);

      if (idStudent < 0) {
        await Student.insert(student);
        idStudent = await Student.getIdByEmail(student);
      }
      await TeacherStudent.insert(idTeacher, idStudent);
    });
    res.status(201).json({ message: "registered" });
  } catch (e) {
    console.log(e);
  }
};

const commonStudents = async (req, res, next) => {
  let queryTeachers = req.query.teacher;
  queryTeachers =
    queryTeachers.constructor === Array ? queryTeachers : [queryTeachers];
  const commonStudents = await TeacherStudent.getCommonStudents(queryTeachers);
  const commonStudentsEmail = commonStudents.map(s => s.email);
  res.json({ students: commonStudentsEmail });
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

const retrieveForNotifications = async (req, res, next) => {
  const { teacher, notification } = req.body;
  const indexTeacher = await Teacher.getIdByEmail(teacher);
  if (indexTeacher < 0) {
    const error = new Error(`Teacher ${teacher} does not exist.`);
    error.name = "UserError";
    return next(error);
  }
  // Get students registered under a teacher by id
  const studentsOfTeacher = await TeacherStudent.getCommonStudents([teacher]);
  // Filter students not suspended
  const studentsNotSuspended = studentsOfTeacher
    .filter(s => !s.is_suspended)
    .map(s => s.email);

  const mentionedStudents = notification
    .match(/(?=[\ @])[^\s]+/g)
    .map(string => string.substr(1));
  const notificationList = studentsNotSuspended
    .concat(mentionedStudents)
    .filter((student, i, arr) => arr.indexOf(student) === i)
    .sort();
  res.status(200).json({ recipients: notificationList });
};

module.exports = {
  teachers,
  students,
  register,
  commonStudents,
  suspend,
  retrieveForNotifications
};
