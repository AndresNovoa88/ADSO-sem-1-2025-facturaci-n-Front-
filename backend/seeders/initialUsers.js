const { User, Rol, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = async () => {
  try {
    // Buscar rol ADMIN
    const rolAdmin = await Rol.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('nombre')),
        'admin'
      )
    });

    if (!rolAdmin) throw new Error('Rol ADMIN no encontrado');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Eliminar usuario admin si ya existía
    await User.destroy({ where: { username: 'admin' } });

    // Crear nuevo usuario admin limpio
    await User.create({
      username: 'admin',
      email: 'admin@facturasena.com',
      password: hashedPassword,
      rol_id: rolAdmin.id
    });

    console.log('✅ Usuario administrador creado');
    console.log('📋 Credenciales:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error.message);
    throw error;
  }
};
