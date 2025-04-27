const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DetalleFactura = sequelize.define('DetalleFactura', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'detalle_factura',
  timestamps: false
});

module.exports = DetalleFactura;