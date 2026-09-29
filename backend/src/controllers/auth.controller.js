const authService = require("../services/auth.service");

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const result = await authService.login(
      username,
      password
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { username, password } = req.body;

    const user = await authService.createUser(
      username,
      password
    );

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register,
};