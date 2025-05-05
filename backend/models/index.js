const { sequelize }   = require('../config/db');
const Rol             = require('./Rol');
const User            = require('./User');
const Cliente         = require('./Cliente');
const Vendedor        = require('./Vendedor');
const Producto        = require('./Producto');
const Factura         = require('./Factura');
const DetalleFactura  = require('./DetalleFactura');

// --- Relaciones Rol ↔ User ---
Rol.hasMany(User,    { foreignKey: 'rol_id' });
User.belongsTo(Rol,  { foreignKey: 'rol_id', as: 'UserRol' });

// --- Cliente ↔ Factura (1:N) ---
Cliente.hasMany(Factura,     { foreignKey: 'cliente_id' });
Factura.belongsTo(Cliente,   { foreignKey: 'cliente_id' });

// --- Vendedor ↔ Factura (1:N) ---
Vendedor.hasMany(Factura,     { foreignKey: 'vendedor_id' });
Factura.belongsTo(Vendedor,   { foreignKey: 'vendedor_id' });

// --- Factura ↔ DetalleFactura (1:N) ---
Factura.hasMany(DetalleFactura,    { foreignKey: 'factura_id' });
DetalleFactura.belongsTo(Factura,  { foreignKey: 'factura_id' });

// --- Producto ↔ DetalleFactura (1:N) ---
Producto.hasMany(DetalleFactura,   { foreignKey: 'producto_id' });
DetalleFactura.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = {
  sequelize,
  Rol,
  User,
  Cliente,
  Vendedor,
  Producto,
  Factura,
  DetalleFactura
};
