// backend/models/index.js
const { sequelize } = require('../config/db');
const Rol           = require('./Rol');
const User          = require('./User');

// Relación 1-N: Rol → Users
Rol.hasMany(User,    { foreignKey: 'rol_id' });
// Solo una belongsTo (ya definido en User.js con alias 'UserRol')
// No repetir alias aquí para evitar colisiones

module.exports = {
  sequelize,
  Rol,
  User
};
