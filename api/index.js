const express = require("express");
const router = express.Router();

// GET /api/unknown
router.get("/unknown", async (req, res, next) => {
  console.log("Request to /api/unknown");
  res.send({
    message: 404,
    content: "Error 404 - Page not found",
  });
});

// GET /api/health
router.get("/health", async (req, res, next) => {
  console.log("Request to /api/health");
  res.send({
    message: "200",
    content: "System running as expected",
  });
});

// ROUTER: /api/users
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require("./routineActivities");
router.use("/routine_activities", routineActivitiesRouter);

module.exports = router;
