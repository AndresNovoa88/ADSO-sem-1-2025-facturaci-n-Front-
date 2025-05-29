// backend/models/index.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Crea la instancia única de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    define: {
      timestamps: false,
      underscored: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Importa modelos
const Rol = require('./Rol');
const User = require('./User');
const Cliente = require('./Cliente');
const Vendedor = require('./Vendedor');
const Producto = require('./Producto');
const Factura = require('./Factura');
const DetalleFactura = require('./DetalleFactura');

// Configura relaciones
Rol.hasMany(User, { foreignKey: 'rol_id' });
User.belongsTo(Rol, { foreignKey: 'rol_id', as: 'UserRol' });

Cliente.hasMany(Factura, { foreignKey: 'cliente_id' });
Factura.belongsTo(Cliente, { foreignKey: 'cliente_id' });

Vendedor.hasMany(Factura, { foreignKey: 'vendedor_id' });
Factura.belongsTo(Vendedor, { foreignKey: 'vendedor_id' });

Factura.hasMany(DetalleFactura, { foreignKey: 'factura_id' });
DetalleFactura.belongsTo(Factura, { foreignKey: 'factura_id' });

Producto.hasMany(DetalleFactura, { foreignKey: 'producto_id' });
DetalleFactura.belongsTo(Producto, { foreignKey: 'producto_id' });

// Prueba de conexión (opcional)
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos exitosa'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

// Exporta todo
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