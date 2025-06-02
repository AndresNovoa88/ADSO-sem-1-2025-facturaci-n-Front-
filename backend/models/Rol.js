const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definición del modelo Cliente
const Rol = sequelize.define('Rol', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Rol;