// backend/middlewares/auth.js
const { secret } = require('../config/config');
const jwt = require('jsonwebtoken');

// Debe exportar una función middleware
module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });
  
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' });
  }
};