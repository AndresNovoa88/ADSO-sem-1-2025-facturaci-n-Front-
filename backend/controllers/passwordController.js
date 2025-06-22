const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { secret } = require("../config/config");

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email no registrado" });

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "15m" });

    // Aquí normalmente enviaríamos un email. Pero lo devolveremos al frontend.
    res.json({
      message: "Token generado",
      resetLink: `/auth/reset-password/${token}`,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error generando token", details: error.message });
  }
};

// POST /auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findByPk(decoded.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Token inválido o expirado", details: error.message });
  }
};

// PUT /auth/change-password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const isMatch = await user.validPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Contraseña actual incorrecta' });
    }

    // Asignar nueva contraseña sin hashear manualmente
    user.password = newPassword;
    await user.save();  // El hook beforeUpdate la hasheará automáticamente

    return res.json({ status: 'success', message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    console.error('💥 Error cambiando contraseña:', error);
    return res.status(500).json({ status: 'error', message: 'Error cambiando contraseña' });
  }
};
