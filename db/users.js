const client = require("./client");

// database functions

// Create User function
async function createUser({ username, password }) {
  try {
    console.log(
      "Inside createUser, Username and Password created: ",
      username,
      password
    );
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password) 
        VALUES($1, $2) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `,
      [username, password]
    );

    return user;
  } catch (error) {
    console.log("Error creating user.");
    throw error;
  }
}

// Get User function
async function getUser({ username, password }) {
  try {
    console.log("Inside getUser.");
    const { user } = await client.query(
      `
        SELECT * FROM users
        WHERE username=$1
        AND password=$2
      `,
      [username, password]
    );

    if (!user) {
      console.log("No user found - Inside getUser.");
      return null;
    }

    return user;
  } catch (error) {
    console.log("Error getting User.");
    throw error;
  }
  // This should be able to verify the password against the hashed password
}

// Get User By ID function
async function getUserById(userId) {
  try {
    console.log("Inside getUserById.");
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT id, username
        FROM users
        WHERE id=${userId}
      `
    );

    if (!user) {
      console.log("No User found - Inside getUserById.");
      return null;
    }

    return user;
  } catch (error) {
    console.log("Error getting User By Id.");
    throw error;
  }
}

// Get User By Username function
async function getUserByUsername(userName) {
  try {
    console.log("Inside getUserByUsername.");
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT id, username
        FROM users
        WHERE username=${userName}
      `
    );

    if (!user) {
      console.log("No User found - Inside getUserByUsername.");
      return null;
    }

    return user;
  } catch (error) {
    console.log("Error getting User By Username.");
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
