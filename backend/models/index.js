// backend/models/index.js
const { sequelize } = require('../config/db');
const Rol = require('./Rol');
const User = require('./User');

// Sincroniza las relaciones
Rol.hasMany(User, { foreignKey: 'rol_id' });
User.belongsTo(Rol, { 
  foreignKey: 'rol_id',
  targetKey: 'id',
  as: 'Rol' // Alias para la relación
 });

module.exports = {
  sequelize,
  Rol,
  User
};