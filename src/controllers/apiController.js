const database = require("../database");

const {
  TABLE_STUDENTS,
  TABLE_TEACHERS,
  TABLE_TEACHERS_STUDENTS
} = require("../constants");

const pool = database.connect();

// GET all teachers (Helper)
const getAllTeachers = async () => {
  const queryStr = `SELECT * from ${TABLE_TEACHERS}`;
  return await database.query(pool, queryStr);
};
// Return all teachers (Helper)
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

// GET a student or teacher's index from db (Helper)
const getIndex = async (table, findPerson) => {
  const queryStr = `SELECT id FROM ${table} WHERE email='${findPerson}'`;
  try {
    const response = await database.query(pool, queryStr);
    if (response.length === 0) return -1;
    return response[0].id;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// Register a student to a teacher
// const register = async (req, res, next) => {
//   const { body } = req;
//   const indexTeacher = await getTeacherIndex(body.teacher); // from db
//   // ERROR-HANDLING: Check if teacher exists, exit if doesn't
//   if (indexTeacher < 0) {
//     return res
//       .status(400)
//       .json({ message: `Teacher ${body.teacher} does not exist.` });
//   }
//   body.students.forEach(async studentEmail => {
//     const response = await database.insertIntoStudentsTable(
//       pool,
//       TABLE_STUDENTS,
//       studentEmail,
//       indexTeacher
//     );
//     // Todo: if registration is 0 then not added.
//     console.log("Student registration", response.insertId);
//   });
//   res.status(204).json({ message: "registered" });
// };
// ERROR-HANDLING:
const checkTeacherExist = (res, indexTeacher, teacherEmail) => {
  if (indexTeacher < 0) {
    return res
      .status(400)
      .json({ message: `Teacher ${teacherEmail} does not exist.` });
  }
};

const register = async (req, res, next) => {
  const { body } = req;
  const { teacher, students } = body;
  // 1. find teacher if exists
  const indexTeacher = await getIndex(TABLE_TEACHERS, teacher); // from db
  let indexStudent;

  // ERROR-HANDLING: Check if teacher exists, exit if doesn't
  checkTeacherExist(res, indexTeacher, teacher);

  students.forEach(async student => {
    // 2. find if each student exist
    indexStudent = await getIndex(TABLE_STUDENTS, student);
    if (indexStudent === -1) {
      // 3. register student if student doesn't exist
      const resRegisterStudent = await database.insert(
        pool,
        TABLE_STUDENTS,
        student
      );
      console.log(
        `Student ${student} inserted with id ${resRegisterStudent.insertId}`
      );
      indexStudent = resRegisterStudent.insertId;
    } else {
      indexStudent = await getIndex(TABLE_STUDENTS, student);
    }
    // populate tbl_teachers_students
    const resInsertTeachersStudents = await database.insertTeacherStudent(
      pool,
      TABLE_TEACHERS_STUDENTS,
      indexTeacher,
      indexStudent
    );
    console.log(resInsertTeachersStudents);
  });

  return res.status(204);
};

// Join students to a common teacher
//SELECT DISTINCT t0.student_id FROM tbl_teachers_students t0 INNER JOIN tbl_teachers_students t1 ON t0.student_id = t1.student_id WHERE t0.teacher_id = 1 AND t1.teacher_id = 3
const commonStudentsQuery = indexesTeachers => {
  let querySelect = `SELECT DISTINCT email FROM ${TABLE_STUDENTS} t `;
  let queryInnerJoin = `INNER JOIN ${TABLE_TEACHERS_STUDENTS} t0 ON t.id = t0.student_id `;
  let queryWhere = `WHERE t0.teacher_id = ${indexesTeachers[0]} `;

  indexesTeachers.forEach((indexTeacher, i) => {
    if (i > 0) {
      queryInnerJoin += `INNER JOIN ${TABLE_TEACHERS_STUDENTS} t${i} ON t.id = t${i}.student_id `;
      queryWhere += `AND t${i}.teacher_id = ${indexTeacher} `;
    }
  });
  return querySelect + queryInnerJoin + queryWhere;
};
const commonStudents = async (req, res, next) => {
  let queryTeachers = req.query.teacher;
  queryTeachers =
    queryTeachers.constructor === Array ? queryTeachers : [queryTeachers];
  const indexesTeachers = await Promise.all(
    queryTeachers.map(async teacher => await getIndex(TABLE_TEACHERS, teacher))
  );

  const response = await database.query(
    pool,
    commonStudentsQuery(indexesTeachers)
  );
  const responseStudents = response.map(resObj => Object.values(resObj)[0]);
  return res.json({ students: responseStudents });
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
  getAllStudents,
  getIndex,
  register,
  commonStudents,
  students,
  suspend,
  teachers,
  retrievefornotifications
};
