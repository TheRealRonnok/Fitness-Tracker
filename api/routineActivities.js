const express = require("express");
const router = express.Router();

const { updateRoutineActivity, destroyRoutineActivity } = require("../db");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", async (req, res, next) => {
  console.log(
    "PATCH /routine_activities/:routineActivityId [UPDATING ROUTINE ACTIVITIES]"
  );
  console.log("req.params : ", req.params);
  console.log("req.body : ", req.body);

  const { count, duration } = req.body;
  const updateFields = {};
  updateFields.id = parseInt(req.params.routineActivityId);

  if (count) {
    updateFields.count = parseInt(count);
  }
  if (duration) {
    updateFields.duration = parseInt(duration);
  }

  try {
    const updatedActivity = await updateRoutineActivity(updateFields);

    if (updatedActivity) {
      res.send({ updatedActivity });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", async (req, res, next) => {
  try {
    // const result = await destroyRoutineActivity();

    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
