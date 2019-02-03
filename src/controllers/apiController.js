const database = require("../database");

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
  const idTeacher = await Teacher.getIdByEmail(teacher); // from db
  let idStudent;

  // ERROR-HANDLING: Check if teacher exists, exit if doesn't
  checkTeacherExist(res, idTeacher, teacher);

  students.forEach(async student => {
    // 2. find if each student exist
    idStudent = await Student.getIdByEmail(student);
    if (idStudent === -1) {
      // 3. register student if student doesn't exist
      const resRegisterStudent = await Student.insert(student);
      console.log(
        `Student ${student} inserted with id ${resRegisterStudent.insertId}`
      );
      idStudent = resRegisterStudent.insertId;
    } else {
      idStudent = await Student.getIdByEmail(student);
    }
    const resInsertTeachersStudents = await TeacherStudent.insert(
      idTeacher,
      idStudent
    );
    if (resInsertTeachersStudents.insertId === 0)
      console.log(`Entry in ${TABLE_TEACHERS_STUDENTS} already exist.`);
    else
      console.log(
        `Entry in ${TABLE_TEACHERS_STUDENTS} inserted with id ${
          resInsertTeachersStudents.insertId
        }.`
      );
  });
  res.status(204);
  return idStudent;
};

// // Join students to a common teacher
// //SELECT DISTINCT t0.student_id FROM tbl_teachers_students t0 INNER JOIN tbl_teachers_students t1 ON t0.student_id = t1.student_id WHERE t0.teacher_id = 1 AND t1.teacher_id = 3
// const commonStudentsQuery = indexesTeachers => {
//   let querySelect = `SELECT DISTINCT email FROM ${TABLE_STUDENTS} t `;
//   let queryInnerJoin = `INNER JOIN ${TABLE_TEACHERS_STUDENTS} t0 ON t.id = t0.student_id `;
//   let queryWhere = `WHERE t0.teacher_id = ${indexesTeachers[0]} `;

//   indexesTeachers.forEach((indexTeacher, i) => {
//     if (i > 0) {
//       queryInnerJoin += `INNER JOIN ${TABLE_TEACHERS_STUDENTS} t${i} ON t.id = t${i}.student_id `;
//       queryWhere += `AND t${i}.teacher_id = ${indexTeacher} `;
//     }
//   });
//   return querySelect + queryInnerJoin + queryWhere;
// };
// const commonStudents = async (req, res, next) => {
//   let queryTeachers = req.query.teacher;
//   queryTeachers =
//     queryTeachers.constructor === Array ? queryTeachers : [queryTeachers];
//   const indexesTeachers = await Promise.all(
//     queryTeachers.map(async teacher => await Teacher.getIdByEmail(teacher))
//   );

//   const response = await database.query(commonStudentsQuery(indexesTeachers));
//   const responseStudents = response.map(resObj => Object.values(resObj)[0]);
//   return res.json({ students: responseStudents });
// };

// const suspend = async (req, res, next) => {
//   const studentToSuspend = req.body.student;
//   // ERROR-HANDLING: check if student exists
//   const indexStudent = await Student.getIdByEmail(studentToSuspend);
//   if (indexStudent < 0)
//     return res
//       .status(400)
//       .json({ message: `Student ${studentToSuspend} does not exist` });

//   await database.update(
//     TABLE_STUDENTS,
//     "is_suspended",
//     1,
//     "email",
//     studentToSuspend
//   );
//   console.log(`Student ${studentToSuspend} suspended.`);
//   res.status(204).json({ message: "suspend" });
// };

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
  register
  // commonStudents,
  // suspend,
  // retrievefornotifications
};
