//backend/routes/passwordRoutes.js
const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const authenticate = require('../middlewares/auth');

// Pública
router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password/:token', passwordController.resetPassword);

// Protegida (usuario logueado)
router.put('/change-password', authenticate, passwordController.changePassword);

module.exports = router;
