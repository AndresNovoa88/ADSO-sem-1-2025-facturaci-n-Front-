const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Vendedor = sequelize.define('Vendedor', {
  nombre:      { type: DataTypes.STRING(100), allowNull: false },
  apellido:    { type: DataTypes.STRING(100), allowNull: false },
  telefono:    { type: DataTypes.STRING(20) },
  email:       { type: DataTypes.STRING(100), validate: { isEmail: true } },
  cuota_ventas:{ type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  estado:      { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'vendedores'
});

module.exports = Vendedor;
