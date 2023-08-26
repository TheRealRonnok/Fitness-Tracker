const express = require("express");
const routineActivitiesRouter = express.Router();
const { requireUser } = require("./utils");

const { updateRoutineActivity, destroyRoutineActivity } = require("../db");

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
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
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const { routineActivityId } = req.params;
      const result = await destroyRoutineActivity(routineActivityId);

      res.send(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routineActivitiesRouter;
