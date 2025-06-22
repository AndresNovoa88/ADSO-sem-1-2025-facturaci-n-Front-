// backend/controllers/authController.js

// backend/controllers/authController.js
require('dotenv').config();
const { User, Rol } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { secret, expiresIn } = require('../config/config');

// Iniciar sesión con usuario real en DB
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('🔐 Intento de login con usuario:', username);

  try {
    // Buscar usuario y su rol
    const user = await User.findOne({
      where: { username },
      include: [{ model: Rol, as: 'UserRol', attributes: ['nombre'] }]
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, role: user.UserRol.nombre },
      secret,
      { expiresIn }
    );

    console.log('✅ Login exitoso para:', username);
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.UserRol.nombre
      }
    });
  } catch (err) {
    console.error('💥 Error en login:', err);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email'],
      include: [{ model: Rol, as: 'UserRol', attributes: ['nombre'] }]
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.UserRol.nombre
    });
  } catch (err) {
    console.error('💥 Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Registro deshabilitado
exports.register = (req, res) => {
  res.status(503).json({
    error: 'Registro deshabilitado',
    message: 'Funcionalidad no disponible en este entorno académico.'
  });
};

