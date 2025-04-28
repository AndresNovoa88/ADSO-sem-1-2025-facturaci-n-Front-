const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { JWT_SECRET } = process.env;

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    
    if (!user || !(await user.validPassword(req.body.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, rol_id: user.rol_id },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};