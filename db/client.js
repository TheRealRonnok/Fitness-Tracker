const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL || "https://localhost:5432/fitness-dev";

const {
  USER: user,
  HOST: host,
  DATABASE: database,
  PASSWORD: password,
  PORT: port,
  SERVER_PORT,
} = process.env;

const client = new Pool({
  user: `postgres`,
  host: "localhost",
  database: "fitness-dev",
  password: `password`,
  port: 5432,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
});

// const client = new Pool({
//   connectionString,
//   ssl:
//     process.env.NODE_ENV === "production"
//       ? { rejectUnauthorized: false }
//       : undefined,
// });

module.exports = client;
