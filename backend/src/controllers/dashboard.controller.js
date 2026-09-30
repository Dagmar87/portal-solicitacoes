const pool = require('../config/database');

async function getDashboard(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (
          WHERE status = 'ABERTO'
        ) AS abertas,
        COUNT(*) FILTER (
          WHERE status = 'EM_ATENDIMENTO'
        ) AS em_atendimento,
        COUNT(*) FILTER (
          WHERE status = 'CONCLUIDO'
        ) AS concluidas
      FROM requests
    `);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard,
};
