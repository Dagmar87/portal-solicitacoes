const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Token não informado",
      });
    }

    const [type, token] =
      authorization.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.sub,
      username: decoded.username,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado",
    });
  }
}

module.exports = authenticate;