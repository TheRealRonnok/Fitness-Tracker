const express = require("express");
const router = express.Router();
const { getUserById } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// Get a user / Verify token
router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next(); // move on to the next fcn call
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

router.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }
  next();
});

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

router.use((error, req, res, next) => {
  res.send({
    message: error.message,
  });
});

module.exports = router;
