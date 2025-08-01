const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vendedor = sequelize.define('Vendedor', {
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El nombre es obligatorio'
      }
    }
  },
  apellido: { 
    type: DataTypes.STRING(100), 
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El apellido es obligatorio'
      }
    }
  },
  telefono: { type: DataTypes.STRING(20) },
  email: { 
    type: DataTypes.STRING(100), 
    validate: { 
      isEmail: {
        msg: 'Debe ser un email válido'
      } 
    } 
  },
  cuota_ventas: { 
    type: DataTypes.DECIMAL(10,2), 
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'La cuota no puede ser negativa'
      }
    }
  },
  estado: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'vendedores',
  timestamps: false 
});

module.exports = Vendedor;