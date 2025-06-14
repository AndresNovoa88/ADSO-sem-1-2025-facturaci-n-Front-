// test-bcrypt.js
const bcrypt = require('bcryptjs');

const storedHash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H1zL3AI6ZR2SAqGBd5n6Jx7UyKS';
const password = 'admin123';

// Verificación con bcrypt.compare
bcrypt.compare(password, storedHash, (err, result) => {
  console.log('Resultado con bcrypt.compare:', result);
  console.log('Error:', err);
});

// Verificación con bcrypt.compareSync
const syncResult = bcrypt.compareSync(password, storedHash);
console.log('Resultado con bcrypt.compareSync:', syncResult);

// Generar nuevo hash para comparar
const salt = bcrypt.genSaltSync(10);
const newHash = bcrypt.hashSync(password, salt);
console.log('Nuevo hash generado:', newHash);
console.log('Comparación con nuevo hash:', bcrypt.compareSync(password, newHash));