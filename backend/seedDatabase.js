// seedDatabase.js
require('dotenv').config();
const { sequelize } = require('./models');
const seedRoles = require('./seeders/initialRoles');
const seedUsers = require('./seeders/initialUsers');

(async () => {
  try {
    console.log('🔁 Sincronizando base de datos...');
    await sequelize.sync({ alter: true });
    
    console.log('🌱 Ejecutando seeders...');
    await seedRoles();
    await seedUsers();
    
    console.log('✅ Base de datos preparada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  }
})();