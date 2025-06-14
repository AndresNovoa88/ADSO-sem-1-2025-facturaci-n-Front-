// config/db.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

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
      timestamps: false,  // Deshabilitar a nivel global
      underscored: true,
    },
    dialectOptions: {
      // Permitir fechas cero
      dateStrings: true,
      typeCast: true,
      flags: '-FOUND_ROWS'
    },
    timezone: '-05:00',  // Ajustar según tu zona horaria
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;