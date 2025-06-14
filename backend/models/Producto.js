// backend/models/Cliente.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false, 
    unique: {
      name: 'nombre_unico',
      msg: 'Ya existe un producto con este nombre'
    },
    validate: {
      notNull: {
        msg: 'El nombre es obligatorio'
      },
      len: {
        args: [3, 100],
        msg: 'El nombre debe tener entre 3 y 100 caracteres'
      }
    }
  },
  descripcion: { 
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 255],
        msg: 'La descripción no puede exceder los 255 caracteres'
      }
    }
  },
  precio: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El precio es obligatorio'
      },
      min: {
        args: [0.01],
        msg: 'El precio debe ser mayor que cero'
      }
    }
  },
  stock: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'El stock debe ser un número entero'
      },
      min: {
        args: [0],
        msg: 'El stock no puede ser negativo'
      }
    }
  },
  categoria: { 
    type: DataTypes.STRING(50),
    validate: {
      len: {
        args: [0, 50],
        msg: 'La categoría no puede exceder los 50 caracteres'
      }
    }
  },
  estado: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'productos',
  timestamps: false,
});

module.exports = Producto;