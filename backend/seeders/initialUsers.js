const { User, Rol } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = async () => {
  try {
    // Buscar rol ADMIN
    const rolAdmin = await Rol.findOne({ where: { nombre: 'ADMIN' } });
    if (!rolAdmin) throw new Error('Rol ADMIN no encontrado. Asegúrate de ejecutar initialRoles.js antes.');

    // Validar si ya existe
    const existing = await User.findOne({ where: { username: 'admin' } });
    if (existing) {
      console.log('Usuario admin ya existe');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      rol_id: rolAdmin.id
    });

    console.log('Usuario administrador creado');
  } catch (error) {
    console.error('Error creando usuario admin:', error.message);
    throw error;
  }
};
