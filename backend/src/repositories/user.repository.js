const pool = require("../config/database");

async function findByUsername(username) {
  const result = await pool.query(
    `
      SELECT
        id,
        username,
        password_hash,
        created_at
      FROM users
      WHERE username = $1
    `,
    [username]
  );

  return result.rows[0];
}

async function findById(id) {
  const result = await pool.query(
    `
      SELECT
        id,
        username,
        created_at
      FROM users
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

async function create(username, passwordHash) {
  const result = await pool.query(
    `
      INSERT INTO users (
        username,
        password_hash
      )
      VALUES ($1, $2)
      RETURNING id, username, created_at
    `,
    [username, passwordHash]
  );

  return result.rows[0];
}

module.exports = {
  findByUsername,
  findById,
  create,
};