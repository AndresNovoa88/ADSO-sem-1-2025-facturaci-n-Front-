// routes/devRoutes.js
const express = require('express');
const router = express.Router();
const { User, Rol } = require('../models');

router.get('/users', async (req, res) => {
  const users = await User.findAll({ include: { model: Rol, as: 'Rol' } });
  res.json(users);
});

module.exports = router;
