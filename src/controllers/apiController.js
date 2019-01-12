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
// GET a teacher's index from db (Helper)
const getIndexTeacher = async findTeacher => {
  const allTeachers = await getAllTeachers();
  return allTeachers.map(dbTeacher => dbTeacher.email).indexOf(findTeacher);
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
// GET a students's index from db (Helper)
const getIndexStudent = async findStudent => {
  const allStudents = await getAllStudents();
  return allStudents.map(dbStudent => dbStudent.email).indexOf(findStudent);
};
// GET all students
const students = async (req, res, next) => {
  // TODO: const queryStr = `DELETE FROM students WHERE id = 3`;
  const results = await getAllStudents();
  res.json(results);
};

// GET teachers_id of a student (Helper)
const getStudentTeachersId = async studentEmail => {
  const queryStr = `SELECT teachers_id from ${TABLE_STUDENTS} WHERE email = '${studentEmail}'`;
  return await database.query(pool, queryStr);
};
// Register a student to a teacher
const register = async (req, res, next) => {
  const { body } = req;
  const indexTeacher = await getIndexTeacher(body.teacher); // from db
  // Check if teacher exists, exit if doesn't
  if (indexTeacher < 0) {
    return res
      .status(400)
      .json({ message: `Teacher ${body.teacher} does not exist.` });
  }

  body.students.forEach(async studentEmail => {
    // Check if student exists
    const indexStudent = await getIndexStudent(studentEmail);
    if (indexStudent < 0) {
      // if student does not exist, add new student
      const results = await database.insert(
        pool,
        TABLE_STUDENTS,
        studentEmail,
        indexTeacher.toString()
      );
      console.log(`Student ${studentEmail} created, ${results.message}`);
    } else {
      // find student's teacher_id column
      const queryResults = await getStudentTeachersId(studentEmail);
      const teachers_id = queryResults[0].teachers_id || [];
      const teachers_idArr = teachers_id.split(",");
      // update student's teacher_id column if yet to be registered
      if (teachers_idArr.indexOf(indexTeacher.toString()) < 0) {
        const updated_teachers_id = [...teachers_idArr, indexTeacher]
          .sort()
          .join(",");
        const results = await database.update(
          pool,
          TABLE_STUDENTS,
          STUDENTS_COL_TEACHERS_ID,
          // "1,2",
          updated_teachers_id,
          "email",
          studentEmail
        );
        console.log(`Student ${studentEmail} updated, ${results.message}`);
      }
    }
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
    queryTeachers.map(async queryTeacher => await getIndexTeacher(queryTeacher))
  );
  // Map through each student, find one whose teachers_id contain all indexes of teachers in query
  allStudents.forEach(student => {
    if (!student.teachers_id) return;
    let bFound = true;
    const teachers_idArr = student.teachers_id
      .split(",")
      .map(id => parseInt(id));

    allQueryTeachersIndex.forEach(id =>
      teachers_idArr.indexOf(id) < 0 ? (bFound = false) : (bFound = true)
    );
    if (bFound) {
      commonStudents.push(
        ...allStudents.filter(s => s.email === student.email).map(s => s.email)
      );
    } //
  });

  res.status(200).json({ message: commonStudents });
};

const suspend = async (req, res, next) => {
  const studentToSuspend = req.body.student;
  console.log(studentToSuspend);
  const results = await database.update(
    pool,
    TABLE_STUDENTS,
    "isSuspended",
    1,
    "email",
    studentToSuspend
  );
  res.json({ message: "suspend" });
};
module.exports = { register, commonstudents, students, suspend, teachers };
