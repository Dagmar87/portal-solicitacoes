const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/user.repository");

async function login(username, password) {
  const user = await userRepository.findByUsername(username);

  if (!user) {
    throw new Error("Usuário ou senha inválidos");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("Usuário ou senha inválidos");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
}

async function createUser(username, password) {
  const existingUser =
    await userRepository.findByUsername(username);

  if (existingUser) {
    throw new Error("Usuário já cadastrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return userRepository.create(
    username,
    passwordHash
  );
}

module.exports = {
  login,
  createUser,
};