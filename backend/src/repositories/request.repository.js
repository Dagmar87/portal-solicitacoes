const pool = require("../config/database");

async function create({
  title,
  description,
  category,
  userId,
}) {
  const result = await pool.query(
    `
      INSERT INTO requests (
        title,
        description,
        category,
        status,
        user_id
      )
      VALUES (
        $1,
        $2,
        $3,
        'ABERTO',
        $4
      )
      RETURNING *
    `,
    [
      title,
      description,
      category,
      userId,
    ]
  );

  return result.rows[0];
}

async function findById(id) {
  const result = await pool.query(
    `
      SELECT
        r.*,
        u.username AS requester
      FROM requests r
      INNER JOIN users u
        ON u.id = r.user_id
      WHERE r.id = $1
    `,
    [id]
  );

  return result.rows[0];
}

async function update(
  id,
  { title, description, category }
) {
  const result = await pool.query(
    `
      UPDATE requests
      SET
        title = $1,
        description = $2,
        category = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `,
    [
      title,
      description,
      category,
      id,
    ]
  );

  return result.rows[0];
}

async function remove(id) {
  await pool.query(
    `
      DELETE FROM requests
      WHERE id = $1
    `,
    [id]
  );
}

async function updateStatus(id, status) {
  const result = await pool.query(
    `
      UPDATE requests
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
    [status, id]
  );

  return result.rows[0];
}

async function findAll(filters = {}) {
  const values = [];
  const conditions = [];

  let index = 1;

  if (filters.category) {
    conditions.push(
      `r.category = $${index}`
    );

    values.push(filters.category);

    index++;
  }

  if (filters.status) {
    conditions.push(
      `r.status = $${index}`
    );

    values.push(filters.status);

    index++;
  }

  if (filters.title) {
    conditions.push(
      `LOWER(r.title) LIKE LOWER($${index})`
    );

    values.push(`%${filters.title}%`);

    index++;
  }

  if (filters.startDate) {
    conditions.push(
      `r.created_at >= $${index}`
    );

    values.push(filters.startDate);

    index++;
  }

  if (filters.endDate) {
    conditions.push(
      `r.created_at <= $${index}`
    );

    values.push(filters.endDate);

    index++;
  }

  const where =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const result = await pool.query(
    `
      SELECT
        r.id,
        r.title,
        r.description,
        r.category,
        r.status,
        r.user_id,
        u.username AS requester,
        r.created_at,
        r.updated_at
      FROM requests r
      INNER JOIN users u
        ON u.id = r.user_id
      ${where}
      ORDER BY r.created_at DESC
    `,
    values
  );

  return result.rows;
}

module.exports = {
  create,
  findById,
  findAll,
  update,
  remove,
  updateStatus,
};