// NOTE: use 'JOIN' in the getPublicRoutinesByActivity based on the activityId
const express = require("express");
const router = express.Router();

const {
  createRoutine,
  getAllPublicRoutines,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
} = require("../db");

// GET /api/routines - Return a list of public routines, include the activities with them
router.get("/api/routines", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    res.send({ routines });
  } catch (error) {
    next(error);
  }
});

// POST /api/routines - Create a new routine
router.post("/", async (req, res, next) => {
  try {
    const newRoutine = await createRoutine(req.body);

    if (newRoutine) {
      res.send(newRoutine);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId - Update a routine, notably change public/private, the name, or the goal
router.patch("/:routineId", async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const patchedParams = {};
  // Update isPublic
  if ("isPublic" in req.body) {
    patchedParams.isPublic = isPublic;
  }
  // Update name
  if (name) {
    patchedParams.name = name;
  }
  // Update goal
  if (goal) {
    patchedParams.description = goal;
  }

  console.log("Patched Parameters: " + patchedParams);

  try {
    const updatedRoutine = await updateRoutine(patchedParams);

    if (updatedRoutine) {
      res.send({ updatedRoutine });
    } else {
      next(console.log("Error patching Routine!"));
      return;
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId - Hard delete a routine. Make sure to delete all the routineActivities whose routine is the one being deleted.
router.delete("/:routineId", async (req, res, next) => {
  let id = parseInt(req.params.routineId);

  try {
    const deletedItem = await getRoutineById(id);

    if (!deletedItem) {
      next(console.log("!"));
      return;
    }

    const rowCount = await destroyRoutine(id);
    if (rowCount < 1) {
      next(console.log("!"));
      return;
    }

    res.send({ message: "Routine was successfully deleted!" });
  } catch (error) {
    next(error);
  }
});

// POST /api/routines/:routineId/activities - Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.

module.exports = router;
