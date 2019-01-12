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

// Register a student to a teacher
const register = async (req, res, next) => {
  const { body } = req;
  const teacherIndex = await getIndexTeacher(body.teacher);
  const studentsIndexes = [];
  // Check if teacher exists, exit if doesn't
  if (teacherIndex < 0) {
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
        teacherIndex
      );
      console.log(`Student ${studentEmail} created, ${results.message}`);
    } else {
      // update student's teacher_id column
      const results = await database.update(
        pool,
        TABLE_STUDENTS,
        STUDENTS_COL_TEACHERS_ID,
        // 12,
        teacherIndex,
        "email",
        studentEmail
      );
      console.log(`Student ${studentEmail} updated, ${results.message}`);
    }
  });

  res.status(204).json({ message: "registered" });
};
// Join students to a common teacher
const commonStudents = (req, res, next) => {
  const store = database.connect();
};
module.exports = { register, commonStudents, students, teachers };
