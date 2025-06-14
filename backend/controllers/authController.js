/* Este codigo esta por ahora fuera debido a error desconocido con el bcryptjs
// Si se requiere, se puede volver a activar y depurar
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../models'); // Importación añadida
const { User, Rol } = require('../models');
const { secret, expiresIn } = require('../config/config');

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
  const { username, password } = req.body;
  console.log('🔐 Intentando login con usuario:', username);

  try {
    const user = await User.findOne({
      where: { username: username },
      include: [{ model: Rol, as: 'UserRol' }],
      raw: true, // Obtener datos crudos
      nest: true // Para mantener la estructura de relaciones
    });

    if (!user) {
      console.log('⚠️ Usuario no encontrado:', username);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('🔍 Información del usuario:');
    console.log('- ID:', user.id);
    console.log('- Username:', user.username);
    console.log('- Rol ID:', user.rol_id);
    console.log('- Rol Nombre:', user.UserRol.nombre);
    console.log('- Password Hash:', user.password);
    console.log('- Longitud del hash:', user.password.length);

    // 1. Verificación directa con bcrypt.compareSync
    const isValid = require('bcryptjs').compareSync(password, user.password);
    console.log('🔑 Resultado comparación bcrypt.compareSync:', isValid);

    // 2. Verificación alternativa
    const isValidManual = (password + user.password).includes('admin123');
    console.log('🔍 Verificación manual (solo debug):', isValidManual);

    // 3. Generar nuevo hash con la misma contraseña
    const salt = require('bcryptjs').genSaltSync(10);
    const testHash = require('bcryptjs').hashSync('admin123', salt);
    console.log('🧪 Hash generado para "admin123":', testHash);

    if (!isValid) {
      console.log('⚠️ Credenciales inválidas para:', username);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Resto del código para generar token...
    const token = jwt.sign(
      { id: user.id, rol: user.UserRol.nombre },
      secret,
      { expiresIn }
    );

    console.log('✅ Login exitoso para:', username);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        rol: user.UserRol.nombre
      },
      message: 'Inicio de sesión exitoso'
    });
    
  } catch (error) {
    console.error('💥 Error en login:', error);
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
      include: [{
        model: Rol,
        as: 'UserRol',
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

*/

const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/config');

// Sistema de usuarios temporal (solo para desarrollo)
const tempUsers = {
  admin: {
    id: 1,
    password: 'admin123', // Contraseña en texto plano (solo para desarrollo)
    rol: 'ADMIN',
    email: 'admin@facturasena.com'
  },
  vendedor: {
    id: 2,
    password: 'vendedor123',
    rol: 'VENDEDOR',
    email: 'vendedor@facturasena.com'
  },
  gerente: {
    id: 3,
    password: 'gerente123',
    rol: 'GERENTE',
    email: 'gerente@facturasena.com'
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('🔐 Intento de login con usuario:', username);

  try {
    // Verificar si el usuario existe en nuestro sistema temporal
    const user = tempUsers[username.toLowerCase()];
    
    if (!user) {
      console.log('⚠️ Usuario no encontrado:', username);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Verificar la contraseña (comparación directa)
    if (password !== user.password) {
      console.log('⚠️ Contraseña incorrecta para:', username);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    console.log('✅ Credenciales válidas para:', username);
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      secret,
      { expiresIn }
    );

    // Responder con el token y datos del usuario
    res.json({
      token,
      user: {
        id: user.id,
        username: username,
        rol: user.rol,
        email: user.email
      },
      message: 'Inicio de sesión exitoso (modo temporal)'
    });
    
  } catch (error) {
    console.error('💥 Error en login:', error);
    res.status(500).json({
      error: 'Error en autenticación',
      details: error.message
    });
  }
};

// Deshabilitar el registro temporalmente
exports.register = async (req, res) => {
  res.status(503).json({ 
    error: 'Registro deshabilitado temporalmente',
    message: 'Estamos trabajando para solucionar problemas técnicos. Por favor intente más tarde.'
  });
};

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    // Buscar usuario en nuestro sistema temporal
    const userId = req.user.id;
    const user = Object.values(tempUsers).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({
      id: user.id,
      username: Object.keys(tempUsers).find(key => tempUsers[key].id === userId),
      rol: user.rol,
      email: user.email
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Error obteniendo perfil',
      details: error.message
    });
  }
};