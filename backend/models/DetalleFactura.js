const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Factura       = require('./Factura');
const Producto      = require('./Producto');

const DetalleFactura = sequelize.define('DetalleFactura', {
  cantidad:        { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  subtotal:        { type: DataTypes.DECIMAL(10,2), allowNull: false },
  factura_id:      {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Factura, key: 'id' }
  },
  producto_id:     {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Producto, key: 'id' }
  }
}, {
  tableName: 'detalle_factura',
  timestamps: false
});

module.exports = DetalleFactura;
