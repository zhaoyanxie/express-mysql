const database = require("../database");

const {
  TABLE_STUDENTS,
  TABLE_TEACHERS,
  STUDENTS_COL_TEACHERS_ID
} = require("../constants");

const pool = database.connect();

// GET all teachers (Helper)
const getAllTeachers = async () => {
  const queryStr = `SELECT * from ${TABLE_TEACHERS}`;
  return await database.query(pool, queryStr);
};
// GET a teacher's UNIQUE index from db (Helper)
const getTeacherIndex = async findTeacher => {
  const queryStr = `SELECT teacher_id FROM ${TABLE_TEACHERS} WHERE teacher_email='${findTeacher}'`;
  try {
    const response = await database.query(pool, queryStr);
    if (response.length === 0) return -1;
    return response[0].teacher_id;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
// Return all teachers
const teachers = async (req, res, next) => {
  const results = await getAllTeachers();
  res.json(results);
};

// GET all students (Helper)
const getAllStudents = async () => {
  const queryStr = `SELECT * from ${TABLE_STUDENTS}`;
  return await database.query(pool, queryStr);
};

// GET all students
const students = async (req, res, next) => {
  const results = await getAllStudents();
  res.json(results);
};

// GET teachers_id of a student and return as an array (Helper)
const getStudentsTeacherId = async studentEmail => {
  const queryStr = `SELECT teacher_id from ${TABLE_STUDENTS} WHERE student_email = '${studentEmail}'`;
  return await database.query(pool, queryStr);
};

// Register a student to a teacher
const register = async (req, res, next) => {
  const { body } = req;
  const indexTeacher = await getTeacherIndex(body.teacher); // from db
  // ERROR-HANDLING: Check if teacher exists, exit if doesn't
  if (indexTeacher < 0) {
    return res
      .status(400)
      .json({ message: `Teacher ${body.teacher} does not exist.` });
  }
  body.students.forEach(async studentEmail => {
    const response = await database.insertIntoStudentsTable(
      pool,
      TABLE_STUDENTS,
      studentEmail,
      indexTeacher
    );
    // Todo: if registration is 0 then not added.
    console.log("Student registration", response.insertId);
  });
  res.status(204).json({ message: "registered" });
};
// Join students to a common teacher
const commonstudents = async (req, res, next) => {
  let queryTeachers = req.query.teacher;
  queryTeachers =
    queryTeachers.constructor === Array ? queryTeachers : [queryTeachers];
  const allStudents = await getAllStudents();
  let commonStudents = [];
  const allQueryTeachersIndex = await Promise.all(
    queryTeachers.map(async queryTeacher => await getTeacherIndex(queryTeacher))
  );
  // Map through each student, find one whose teachers_id contain all indexes of teachers in query
  allStudents.forEach(student => {
    if (!student.teachers_id) return;
    let bFound = false;
    const countFound = [];
    const teachers_idArr = student.teachers_id
      .split(",")
      .map(id => parseInt(id));

    allQueryTeachersIndex.forEach(id => {
      if (teachers_idArr.indexOf(id) >= 0) {
        countFound.push(true);
      }
    });
    bFound = countFound.length === allQueryTeachersIndex.length ? true : false;
    if (bFound) {
      commonStudents.push(
        ...allStudents.filter(s => s.email === student.email).map(s => s.email)
      );
    }
  });

  res.status(200).json({ students: commonStudents });
};

const suspend = async (req, res, next) => {
  const studentToSuspend = req.body.student;
  // ERROR-HANDLING: check if student exists
  const indexStudent = await getStudentIndex(studentToSuspend);
  if (indexStudent < 0)
    return res
      .status(400)
      .json({ message: `Student ${studentToSuspend} does not exist` });

  await database.update(
    pool,
    TABLE_STUDENTS,
    "isSuspended",
    1,
    "email",
    studentToSuspend
  );
  res.status(204).json({ message: "suspend" });
};

const retrievefornotifications = async (req, res, next) => {
  const { teacher, notification } = req.body;
  // Criteria 1: must not be suspended
  const criteria1 = "isSuspended = 0";
  const queryStr = `SELECT (email), (teachers_id) FROM ${TABLE_STUDENTS} WHERE ${criteria1}`;
  const studentsNotSuspended = await database.query(pool, queryStr);
  // console.log("results", studentsNotSuspended);

  // Criteria 2: registered with teacher OR mentioned notification
  // filter out students registered with teacher
  const teacherIndex = await getTeacherIndex(teacher);
  // ERROR-HANDLING: Check if teacher exists, exit if doesn't
  if (teacherIndex < 0) {
    return res
      .status(400)
      .json({ message: `Teacher ${teacher} does not exist.` });
  }
  const notificationList = studentsNotSuspended
    .filter(student => {
      const teachers_id = student.teachers_id || "";
      const teachers_idArr = teachers_id.split(",").map(id => parseInt(id));
      return teachers_idArr.indexOf(teacherIndex) >= 0;
    })
    .map(student => student.email);

  // add to to notification list those mentioned
  const mentionedStudents = notification
    .match(/(?=[\ @])[^\s]+/g)
    .map(string => string.substr(1));
  mentionedStudents.forEach(mentionedStudent => {
    if (notificationList.indexOf(mentionedStudent) < 0) {
      notificationList.push(mentionedStudent);
    }
  });
  res.status(200).json({ recipients: notificationList });
};
module.exports = {
  getAllTeachers,
  getTeacherIndex,
  getAllStudents,
  getStudentsTeacherId,
  register,
  commonstudents,
  students,
  suspend,
  teachers,
  retrievefornotifications
};
