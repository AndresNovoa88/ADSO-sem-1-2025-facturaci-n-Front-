const seedRoles = require('./initialRoles');
const seedUsers = require('./initialUsers');
const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { User } = require('../models'); 

const runSeed = async () => {
  try {
    await sequelize.sync({ alter: true });

    await seedRoles();
    await seedUsers();

    console.log('Seeding completo');
    process.exit(0);
  } catch (error) {
    console.error('Error durante el seeding:', error);
    process.exit(1);
  }
};

runSeed();
