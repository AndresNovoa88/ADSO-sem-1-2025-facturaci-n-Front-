const { Rol } = require('../models');

module.exports = async () => {
  try {
    // Roles requeridos
    const requiredRoles = [
      { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
      { nombre: 'GERENTE', descripcion: 'Gerente de la empresa' },
      { nombre: 'VENDEDOR', descripcion: 'Vendedor autorizado' }
    ];

    for (const role of requiredRoles) {
      await Rol.findOrCreate({
        where: { nombre: role.nombre },
        defaults: role
      });
    }
    
    console.log('✅ Roles verificados/creados');
  } catch (error) {
    console.error('❌ Error creando roles:', error.message);
    throw error;
  }
};