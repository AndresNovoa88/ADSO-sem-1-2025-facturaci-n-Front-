const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definición del modelo Cliente
const Cliente = sequelize.define('Cliente', {
  nombre:    { type: DataTypes.STRING,  allowNull: false },
  apellido:  { type: DataTypes.STRING,  allowNull: false },
  direccion: { type: DataTypes.STRING  },
  telefono:  { type: DataTypes.STRING  },
  email:     { type: DataTypes.STRING, validate: { isEmail: true } },
  estado:    { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'clientes'
});

module.exports = Cliente;
