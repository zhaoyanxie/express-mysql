const MYSQL_TABLENAME_STUDENTS = "tbl_students";
const MYSQL_TABLENAME_TEACHERS = "tbl_teachers";
const MYSQL_TABLENAME_TEACHERS_STUDENTS = "tbl_teachers_students";
const TEACHERS = [
  { email: "teacherjim@email.com" },
  { email: "teacherjoe@email.com" },
  { email: "teacherken@email.com" }
];

const STUDENTS = [
  { email: "studentOnlyJim@email.com" },
  { email: "studentJimAndJoe@email.com" },
  { email: "studentOnlyJoe@email.com" }
];
module.exports = {
  TEACHERS,
  STUDENTS,
  TABLE_STUDENTS: MYSQL_TABLENAME_STUDENTS,
  TABLE_TEACHERS: MYSQL_TABLENAME_TEACHERS,
  TABLE_TEACHERS_STUDENTS: MYSQL_TABLENAME_TEACHERS_STUDENTS
};
