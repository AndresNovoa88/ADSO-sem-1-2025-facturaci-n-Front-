// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/auth');

// Registro, login y perfil protegido
router.post('/register', authController.register);
router.post('/login',    authController.login);
router.get( '/profile',  authenticate, authController.getProfile);

module.exports = router;
