// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');             // ▶️ para logging de peticiones
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const facturaRoutes = require('./routes/facturaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARES ────────────────────────────────────
// 1) Logging de cada petición
app.use(morgan('dev'));

// 2) Health check rápido
app.get('/heartbeat', (req, res) => res.json({ status: 'up' }));

// 3) CORS y JSON
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// ── RUTAS ───────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/facturas', facturaRoutes);

// Ruta de desarrollo para reset de contraseña (solo dev)
if (process.env.NODE_ENV !== 'production') {
  console.log('⚠️ Ruta de desarrollo /dev habilitada');
  app.use('/dev', require('./routes/devRoutes'));
}

// ── INICIO DEL SERVIDOR ────────────────────────────
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a DB exitosa');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');
    await require('./seeders/initialRoles')();  // Seedear roles
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error('❌ Error de inicialización:', error);
    process.exit(1);
  }
})();
