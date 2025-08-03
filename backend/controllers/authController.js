// backend/controllers/authController.js
//require('dotenv').config();
const { User, Rol } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { secret, expiresIn } = require('../config/config');

// Login con usuario real de la base de datos (con console logs para debugging)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('🔐 login invoked');
  console.log('Received credentials:', { username, password });

  try {
    // Buscar usuario y rol
    const user = await User.findOne({
      where: { username },
      include: [{ model: Rol, as: 'UserRol', attributes: ['nombre'] }]
    });
    console.log("Rol asociado:", user.Rol);

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    // Mostrar hash almacenado para debugging
    console.log('Stored hash for user:', user.password);

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    if (!isMatch) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = jwt.sign({ id: user.id, role: user.UserRol.nombre }, secret, { expiresIn });
    console.log('✅ Login exitoso, token generado');

   console.log("🧾 Enviando respuesta con token y usuario:", {
  token,
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    rol: user.UserRol?.nombre || null
  }
});

    return res.json({
      status: 'success',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.UserRol?.nombre || null
      },
      message: 'Inicio de sesión exitoso'
    });
  } catch (error) {
    console.error('💥 Error en login:', error);
    return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
};

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  console.log('🔄 getProfile invoked for user ID:', req.user.id);
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email'],
      include: [{ model: Rol, as: 'UserRol', attributes: ['nombre'] }]
    });
    if (!user) {
      console.log('❌ Usuario no encontrado en getProfile');
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }
    console.log('✅ Profile data:', user.username);
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.UserRol.nombre
    });
  } catch (error) {
    console.error('💥 Error en getProfile:', error);
    res.status(500).json({ status: 'error', message: 'Error interno' });
  }
};

// Registro deshabilitado
exports.register = (req, res) => {
  console.log('🚫 register invoked');
  res.status(503).json({ status: 'error', error: 'Registro deshabilitado' });
};


