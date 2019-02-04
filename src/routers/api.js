const express = require("express");

const router = express.Router();
router.use(express.json());

const apiController = require("../controllers/apiController");
const { asyncErrorHandler } = require("../middlewares/asyncErrorHandler");
const { error400sHandler } = require("../middlewares/errorHandler");

router.get("/teachers", asyncErrorHandler(apiController.teachers));
router.get("/students", asyncErrorHandler(apiController.students));
router.post("/register", asyncErrorHandler(apiController.register));
router.get("/commonstudents", asyncErrorHandler(apiController.commonStudents));
router.post("/suspend", asyncErrorHandler(apiController.suspend));
router.post(
  "/retrievefornotifications",
  asyncErrorHandler(apiController.retrieveForNotifications)
);

module.exports = app => {
  app.use("/api", router, error400sHandler);
};
