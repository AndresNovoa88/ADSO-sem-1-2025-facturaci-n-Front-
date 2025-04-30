// seeders/initialRoles.js
const { Rol } = require('../models'); // Importación desde el index.js de modelos

module.exports = async () => {
  try {
    await Rol.bulkCreate([
      { nombre: 'ADMIN', descripcion: 'Administrador del sistema' },
      { nombre: 'GERENTE', descripcion: 'Gerente de la empresa' },
      { nombre: 'VENDEDOR', descripcion: 'Vendedor autorizado' }
    ], {
      ignoreDuplicates: true,
      validate: true 
    });
    console.log('Roles iniciales creados exitosamente');
  } catch (error) {
    console.error('Error creando roles:', error.message);
    throw error;
  }
};