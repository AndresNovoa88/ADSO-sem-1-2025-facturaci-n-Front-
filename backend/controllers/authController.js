const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/config');

exports.register = async (req, res) => {
  try {
    const { username, password, email, rol_id } = req.body;
    const user = await User.create({ username, password, email, rol_id });
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isValid = await user.validPassword(password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, rol_id: user.rol_id },
      secret,
      { expiresIn: '8h' }
    );
    
    res.json({ token, user: { id: user.id, username: user.username, rol_id: user.rol_id } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};