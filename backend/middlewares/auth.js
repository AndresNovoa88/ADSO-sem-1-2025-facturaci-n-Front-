const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar roles
module.exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol_id)) {
      return res.status(403).json({ error: 'Acceso denegado. Permisos insuficientes' });
    }
    next();
  };
};