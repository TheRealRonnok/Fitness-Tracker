const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    // console.log("Inside addActivityToRoutine.");
    const {
      rows: [activity],
    } = await client.query(
      `
        INSERT INTO "routine-activities"("routineId", "activityId", count, duration) 
        VALUES($1, $2, $3, $4) 
        RETURNING *;
      `,
      [routineId, activityId, count, duration]
    );

    console.log(
      "Inside addActivityToRoutine, Activity added to Routine: ",
      routineId,
      activityId,
      count,
      duration
    );

    return activity;
  } catch (error) {
    console.log("Error adding activity to Routine-Activities.");
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    console.log("Inside getRoutineActivityById.");
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT *
        FROM "routine-activities"
        WHERE id=${id}
      `
    );

    if (!routine) {
      console.log("No Routine-Activity found - Inside getRoutineActivityById.");
      return null;
    }

    return routine;
  } catch (error) {
    console.log("Error getting Routine-Activity By Id.");
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    console.log("Inside getRoutineActivityById.");
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT *
        FROM "routine-activities"
        WHERE "routineId"=${id}
      `
    );

    if (!routine) {
      console.log("No Routine-Activity found - Inside getRoutineActivityById.");
      return null;
    }

    return routine;
  } catch (error) {
    console.log("Error getting Routine-Activity By Id.");
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  // don't try to update the id
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  console.log("Inside updateRoutineActivity, String set to: ", setString);

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  // do update the name and description
  try {
    console.log("Inside updateRoutineActivity.");
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE "routine-activities"
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    // return the updated routine-activity
    return activity;
  } catch (error) {
    console.log("Error updating Routine-Activity.");
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  console.log("Inside destroyRoutineActivity.");

  try {
    const { routine } = await client.query(`
        DELETE FROM "routine-activities"
        WHERE id=${id}
      `);

    console.log("Successfully deleted Routine-Activity.");

    return routine;
  } catch (error) {
    console.log("Error destroying Routine-Activity.");
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
