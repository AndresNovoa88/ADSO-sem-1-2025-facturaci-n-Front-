const { User, Rol, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = async () => {
  try {
    // Buscar rol ADMIN (insensible a mayúsculas)
    const rolAdmin = await Rol.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('nombre')),
        'admin'
      )
    });
    
    if (!rolAdmin) throw new Error('Rol ADMIN no encontrado');

    // Crear o actualizar usuario admin
    const [adminUser] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        email: 'admin@facturasena.com',
        password: await bcrypt.hash('admin123', 10),
        rol_id: rolAdmin.id
      }
    });

    // Actualizar si ya existía
    if (!adminUser.isNewRecord) {
      adminUser.rol_id = rolAdmin.id;
      adminUser.password = await bcrypt.hash('admin123', 10);
      await adminUser.save();
      console.log('✅ Usuario administrador actualizado');
    } else {
      console.log('✅ Usuario administrador creado');
    }

    console.log('📋 Credenciales:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error.message);
    throw error;
  }
};