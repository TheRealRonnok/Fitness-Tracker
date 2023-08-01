/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();

const {
  getUserByUsername,
  createUser,
  getUser,
  getPublicRoutinesByUser,
} = require("../db");

router.use((req, res, next) => {
  next();
});

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  if (password.length < 8) {
    next(console.log("The password is too short!"));
    return;
  }
  if (username.length < 5) {
    next(console.log("The username is too short!"));
    return;
  }

  try {
    const user = await getUserByUsername(username);
    // Check to see if username is already taken
    if (user) {
      next(console.log("That username is already taken!"));
      return;
    }

    const result = await createUser({
      username,
      password,
    });
    console.log("Registration result: ", result);
    res.send({
      message: "User Registered!",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // Check to ensure both username and password are there
  if (!username || !password) {
    next(console.log("Login Error!"));
    return;
  }

  try {
    const user = await getUser(req.body);

    if (!user) {
      next(console.log("Username does not exist!"));
      return;
    }
    res.send({ message: "Successful Login!" });
  } catch (error) {
    next(console.log("Incorrect password!"));
  }
});

// GET /api/users/me
router.get("/me", async (req, res, next) => {
  try {
    const userMe = await getUser(req.params);

    res.send({ userMe });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
router.get("/:username/routines", async (req, res, next) => {
  try {
    const userRoutines = await getPublicRoutinesByUser(req.params);

    res.send({ userRoutines });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
