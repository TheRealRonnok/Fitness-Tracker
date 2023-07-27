const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  try {
    console.log("Inside createActivity.");
    const {
      rows: [activity],
    } = await client.query(
      `
        INSERT INTO activities(name, description) 
        VALUES($1, $2) 
        ON CONFLICT (name) DO NOTHING 
        RETURNING *;
      `,
      [name, description]
    );

    return activity;
  } catch (error) {
    console.log("Error creating Activity.");
    throw error;
  }
}

// Get All Activities function
async function getAllActivities() {
  try {
    console.log("Inside getAllActivities.");

    const { rows } = await client.query(`
        SELECT id, name, description FROM activities;
      `);

    return rows;
  } catch (error) {
    console.log("Error creating Activity.");
    throw error;
  }
  // select and return an array of all activities
}

// Get Activity By Id function
async function getActivityById(id) {
  try {
    console.log("Inside getActivityById.");
    const {
      rows: [activity],
    } = await client.query(
      `
        SELECT id, name, description
        FROM activities
        WHERE id=${id}
      `
    );

    if (!activity) {
      console.log("No activity found - Inside getActivityById.");
      return null;
    }

    return activity;
  } catch (error) {
    console.log("Error getting Activity By Id.");
    throw error;
  }
}

// Get Activity By Name function
async function getActivityByName(name) {
  try {
    console.log("Inside getActivityByName.");
    const {
      rows: [activity],
    } = await client.query(
      `
        SELECT id, name, description
        FROM activities
        WHERE name=${name}
      `
    );

    if (!activity) {
      console.log("No activity found - Inside getActivityByName.");
      return null;
    }

    return activity;
  } catch (error) {
    console.log("Error getting Activity By Name.");
    throw error;
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

// Update Activity function
async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  console.log("Inside updateActivity, String set to: ", setString);

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  // do update the name and description
  try {
    console.log("Inside updateActivity.");
    const {
      rows: [activity],
    } = await client.query(
      `
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );

    // return the updated activity
    return activity;
  } catch (error) {
    console.log("Error updating Activity.");
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
