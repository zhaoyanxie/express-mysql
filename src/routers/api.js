const express = require("express");

const router = express.Router();
router.use(express.json());

const apiController = require("../controllers/apiController");

// GET: all teachers
router.get("/teachers", apiController.teachers);
// GET: all students
router.get("/students", apiController.students);
// POST: register a student to a teacher
router.post("/register", apiController.register);
router.post("/try", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "ok" });
});
// GET: common students to array of teachers
router.get("/commonstudents", apiController.commonStudents);
// POST: suspend student
// router.post("/suspend", apiController.suspend);
// POST: send notification to student
// router.post(
//   "/retrievefornotifications",
//   apiController.retrievefornotifications
// );

module.exports = app => {
  app.use("/api", router);
};
