// backend/scripts/updateAdminPassword.js
//esto nos sirve para actualizar la contraseña del usuario admin en la base de datos
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();

    // Genera un nuevo hash para "admin123"
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);

    // Actualiza la contraseña del admin
    const [affected] = await User.update(
      { password: hash },
      { where: { username: 'admin' } }
    );

    if (affected) {
      console.log('✅ Contraseña de admin actualizada correctamente.');
      console.log('Nuevo hash (para referencia):', hash);
    } else {
      console.log('⚠️ No se encontró al usuario admin para actualizar.');
    }
  } catch (err) {
    console.error('❌ Error actualizando contraseña:', err);
  } finally {
    await sequelize.close();
    process.exit();
  }
})();
