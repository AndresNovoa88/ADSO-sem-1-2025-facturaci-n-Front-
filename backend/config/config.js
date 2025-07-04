const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_segura_y_compleja";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

// Función para generar token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS512",
  });
};

// Middleware de autenticación
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error("❌ Error de verificación JWT:", err);
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Función para verificar roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Acceso no autorizado para este rol",
      });
    }
    next();
  };
};

module.exports = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRES_IN,
  generateToken,
  authenticateJWT,
  authorizeRoles,
};
