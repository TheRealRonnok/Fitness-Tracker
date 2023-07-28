const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    console.log(
      `Inside createRoutine. Routine to create: ${creatorId} ${isPublic} ${name} ${goal}`
    );
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines ("creatorId", "IsPublic", name, goal) 
        VALUES($1, $2, $3, $4)
        RETURNING *;
      `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    console.log("Error creating Routine.");
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    console.log("Inside getRoutineById.");
    const {
      rows: [routine],
    } = await client.query(
      `
        SELECT *
        FROM routines
        WHERE id=${id}
      `
    );

    if (!routine) {
      console.log("No Routine found - Inside getRoutineById.");
      return null;
    }

    return routine;
  } catch (error) {
    console.log("Error getting Routine By Id.");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    console.log("Inside getRoutinesWithoutActivities.");
    // select and return an array of all routines
    const { rows: routines } = await client.query(`SELECT * FROM routines;`);

    if (!routines) {
      console.log("No Routines found - Inside getRoutinesWithoutActivities.");
      return null;
    }

    return routines;
  } catch (error) {
    console.log("Error getting Routines Without Activities.");
    throw error;
  }
}

async function getAllRoutines() {
  try {
    console.log("Inside getAllRoutines.");

    const { routine } = await client.query(`
        SELECT * FROM routines;
      `);

    if (!routine) {
      console.log("No Routines found - Inside getAllRoutines.");
      return null;
    }

    return routine;
  } catch (error) {
    console.log("Error getting Routines.");
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    console.log("Inside getAllPublicRoutines.");

    const { routine } = await client.query(`
        SELECT * FROM routines
        WHERE "isPublic"=TRUE
      `);

    if (!routine) {
      console.log("No Public Routines found - Inside getAllPublicRoutines.");
      return null;
    }

    return routine;
  } catch (error) {
    console.log("Error getting Routines.");
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    console.log("Inside getAllRoutinesByUser.");

    const { routine } = await client.query(`
        SELECT * FROM routines
        WHERE username=${username}
      `);

    if (!routine) {
      console.log(
        "No Routines for this User found - Inside getAllRoutinesByUser."
      );
      return null;
    }

    return routine;
  } catch (error) {
    console.log("Error getting Routines by User.");
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    console.log("Inside getPublicRoutinesByUser.");

    const { routine } = await client.query(`
        SELECT * FROM routines
        WHERE username=${username}
        AND "isPublic"=TRUE
      `);

    if (!routine) {
      console.log(
        "No Public Routines for this User found - Inside getPublicRoutinesByUser."
      );
      return null;
    }

    return routine;
  } catch (error) {
    console.log("Error getting Public Routines by User.");
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    console.log("Inside getPublicRoutinesByActivity.");

    const {
      rows: [routines],
    } = await client.query(
      `
        SELECT r."isPublic", r.name, ra.*
        FROM routines r JOIN routineactivities ra
        ON ra."activityId"=${id}
        AND r."isPublic"=TRUE;
      `
    );

    if (!routines) {
      console.log(
        "No Public Routines for this Activity found - Inside getPublicRoutinesByActivity."
      );
      return null;
    }

    return routines;
  } catch (error) {
    console.log("Error getting Public Routines by Activity.");
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  console.log("Inside updateRoutine, String set to: ", setString);

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    console.log("Inside updateRoutine.");
    const {
      rows: [routine],
    } = await client.query(
      `
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    if (!routine) {
      console.log("No Routine to Update - Inside updateRoutine.");
      return null;
    }

    // return the updated routine
    return routine;
  } catch (error) {
    console.log("Error updating Routine.");
    throw error;
  }
}

async function destroyRoutine(id) {
  console.log("Inside destroyRoutine.");

  try {
    const { routine } = await client.query(`
        DELETE FROM routines
        WHERE id=${id}
      `);

    console.log("Successfully deleted routine.");

    return routine;
  } catch (error) {
    console.log("Error destroying Routine.");
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
