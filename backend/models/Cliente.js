// backend/models/Cliente.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cliente = sequelize.define(
  "Cliente",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "El nombre es obligatorio" },
      },
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "El apellido es obligatorio" },
      },
    },
    direccion: { type: DataTypes.STRING },
    telefono: { 
    type: DataTypes.STRING,
    validate: {
      is: {
        args: /^[0-9+-\s()]{7,15}$/,
        msg: "Teléfono inválido"
      }
    }
  },
  email: { 
    type: DataTypes.STRING, 
    validate: { 
      isEmail: {
        msg: "Debe ser un email válido"
      } 
    } 
  },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "clientes",
  }
);

module.exports = Cliente;