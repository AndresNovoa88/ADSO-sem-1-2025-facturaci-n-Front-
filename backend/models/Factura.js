const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cliente       = require('./Cliente');
const Vendedor      = require('./Vendedor');

const Factura = sequelize.define('Factura', {
  codigo:     { type: DataTypes.STRING(20), allowNull: false, unique: true },
  fecha:      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  subtotal:   { type: DataTypes.DECIMAL(10,2), allowNull: false },
  impuesto:   { type: DataTypes.DECIMAL(10,2), allowNull: false },
  total:      { type: DataTypes.DECIMAL(10,2), allowNull: false },
  estado:     { type: DataTypes.STRING(20), defaultValue: 'PENDIENTE' },
  cliente_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: Cliente, key: 'id' } 
  },
  vendedor_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Vendedor, key: 'id' }
  }
}, {
  tableName: 'facturas'
});

module.exports = Factura;
