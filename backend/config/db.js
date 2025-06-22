const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Solo exporta la instancia de Sequelize directamente
module.exports = new Sequelize(
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
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    timezone: '-05:00',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);