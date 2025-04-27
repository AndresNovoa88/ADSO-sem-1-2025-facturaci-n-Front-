const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Factura = sequelize.define('Factura', {
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  impuesto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'PENDIENTE'
  }
}, {
  tableName: 'facturas'
});

module.exports = Factura;