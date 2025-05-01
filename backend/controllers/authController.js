// backend/controllers/authController.js
const jwt       = require('jsonwebtoken');
const { User, Rol } = require('../models');
const { secret, expiresIn } = require('../config/config');
const bcrypt    = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      rol_id: user.rol_id
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error en registro',
      details: error.errors.map(e => e.message)
    });
  }
};

exports.login = async (req, res) => {
  const { username, password, newPassword } = req.body;
  console.log('🔐 Intentando login con usuario:', username);

  try {
    // Buscamos al usuario **incluyendo el Rol** con alias 'UserRol'
    const user = await User.findOne({
      where: { username },
      include: [{ model: Rol, as: 'UserRol' }]
    });

    if (!user || !(await user.validPassword(password))) {
      console.log('⚠️ Credenciales inválidas para:', username);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Si vienen 'newPassword', la guardamos (hook en User la hashea)
    if (newPassword) {
      user.password = newPassword;
      await user.save();
      console.log(`🔄 Contraseña restablecida para ${username}`);
    }

    // Generamos token con el nombre del rol
    const token = jwt.sign(
      { id: user.id, rol: user.UserRol.nombre },
      secret,
      { expiresIn }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        rol: user.UserRol.nombre
      },
      message: newPassword
        ? 'Contraseña actualizada exitosamente'
        : 'Inicio de sesión exitoso'
    });
  } catch (error) {
    console.error('💥 Error en login:', error);
    return res.status(500).json({
      error: 'Error en autenticación',
      details: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Rol,
        as: 'UserRol',                  // mismo alias
        attributes: ['nombre', 'descripcion']
      }]
    });
    res.json({
      ...user.toJSON(),
      rol: user.UserRol.nombre
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error obteniendo perfil',
      details: error.message
    });
  }
};
