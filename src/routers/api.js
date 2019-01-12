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

module.exports = app => {
  app.use("/api", router);
};
