const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Producto = sequelize.define('Producto', {
  nombre:     { type: DataTypes.STRING(100), allowNull: false, unique: true },
  descripcion:{ type: DataTypes.TEXT },
  precio:     { type: DataTypes.DECIMAL(10,2), allowNull: false },
  stock:      { type: DataTypes.INTEGER, defaultValue: 0 },
  categoria:  { type: DataTypes.STRING(50) },
  estado:     { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'productos'
});

module.exports = Producto;
