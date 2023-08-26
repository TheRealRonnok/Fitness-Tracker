/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const { requireUser } = require("./utils");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const {
  getUserByUsername,
  createUser,
  getUser,
  getPublicRoutinesByUser,
} = require("../db");

usersRouter.use((req, res, next) => {
  next();
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
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
    const _user = await getUserByUsername(username);
    // Check to see if username is already taken
    if (_user) {
      next(console.log("That username is already taken!"));
      return;
    }

    const user = await createUser({
      username,
      password,
    });
    console.log("Registration result: ", user);
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1w" }
    );
    res.send({ user, message: "Registration successful!", token });
  } catch (error) {
    next(error);
  }
});

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
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
    } else {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1w" }
      );
      res.send({ user, message: "Successful Login!", token });
    }
  } catch (error) {
    next(console.log("Incorrect password!"));
  }
});

// GET /api/users/me
usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    const userMe = await getUser(req.params);

    res.send({ userMe });
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", requireUser, async (req, res, next) => {
  try {
    const userRoutines = await getPublicRoutinesByUser(req.params);

    res.send({ userRoutines });
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
