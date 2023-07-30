// NOTE: use 'JOIN' in the getPublicRoutinesByActivity based on the activityId
const express = require("express");
const { getAllRoutines } = require("../db");
const router = express.Router();

// GET /api/routines
router.get("/api/routines", async (req, res, next) => {
  try {
    const routines = await getAllRoutines();
    res.send({ routines });
  } catch (error) {
    next(error);
  }
});

// POST /api/routines
router.post("/reports/:reportId/comments", async (req, res, next) => {
  try {
    const { reportId } = req.params;

    const newComment = await createReportComment(reportId, req.body);

    res.send(newComment);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
