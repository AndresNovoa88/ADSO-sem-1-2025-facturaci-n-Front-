// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const { User, Rol } = require('../models'); // Importar ambos modelos
const { secret, expiresIn } = require('../config/config'); // Usar configuración centralizada

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      rol_id: user.rol_id // Incluir rol en respuesta
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'Error en registro',
      details: error.errors.map(e => e.message) 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { username: req.body.username },
      include: [{model: Rol, as:'Rol'}] // Incluir relación con Rol
    });

    if (!user || !(await user.validPassword(req.body.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        rol: user.Rol.nombre // Usar nombre del rol desde la relación
      },
      secret,
      { expiresIn }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        rol: user.Rol.nombre
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error en autenticación',
      details: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: {
        model: Rol,
        attributes: ['nombre', 'descripcion']
      }
    });
    
    res.json({
      ...user.toJSON(),
      rol: user.Rol.nombre
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error obteniendo perfil',
      details: error.message
    });
  }
};