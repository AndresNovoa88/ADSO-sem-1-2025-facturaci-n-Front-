// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Rol = require('./Rol');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Rol,
      key: 'id'
    }
  }
}, {
  tableName: 'usuarios',      
  timestamps: false,          
  hooks: {
  beforeCreate: async (user) => {
    if (user.password && !user.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  },
  beforeUpdate: async (user) => {
    if (user.changed('password') && !user.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
}
});

// Método de instancia para validar contraseña
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;

