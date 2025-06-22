//backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(morgan('dev'));
app.get('/heartbeat', (req, res) => res.json({ status: 'up' }));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tudominio.com' 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendedores', vendedorRoutes);
app.use('/api/auth', passwordRoutes);

if (process.env.NODE_ENV !== 'production') {
  console.log('⚠️ Ruta de desarrollo /dev habilitada');
  app.use('/dev', require('./routes/devRoutes'));
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err);
  res.status(500).json({
    error: 'Error interno',
    message: process.env.NODE_ENV === 'production' 
      ? 'Contacte al soporte' 
      : err.message
  });
});

// Inicio del servidor
const startServer = async () => {
  try {
    console.log("🔍 Configuración DB:", {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      environment: process.env.NODE_ENV || 'development'
    });

    // Conexión con reintentos
    const maxRetries = 5;
    for (let i = 1; i <= maxRetries; i++) {
      try {
        console.log(`🔌 Conexión a DB (Intento ${i}/${maxRetries})`);
        await sequelize.authenticate();
        console.log('✅ Conexión a DB exitosa');
        break;
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          throw error;
        }
      }
    }

    // 🔧 SOLUCIÓN: Ajustar configuración SQL para evitar error de fechas
    console.log('🔧 Ajustando configuración SQL para sincronización...');
    await sequelize.query("SET SESSION sql_mode = 'NO_ENGINE_SUBSTITUTION'");
    
    // Sincronización segura
    const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
    console.log(`🔄 Sincronizando modelos con opciones:`, syncOptions);
    await sequelize.sync(syncOptions);
    
    // Restaurar configuración segura
    console.log('↩️ Restaurando configuración SQL...');
    await sequelize.query("SET SESSION sql_mode = 'STRICT_ALL_TABLES'");
    console.log('✅ Modelos sincronizados | Modo SQL restaurado');

    // Datos iniciales
    console.log('🌱 Verificando datos iniciales...');
    await require('./seeders/initialRoles')();
    console.log('✅ Datos iniciales listos');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor en http://localhost:${PORT}`);
      console.log(`⏰ Inicio: ${new Date().toLocaleString()}`);
      if (process.env.NODE_ENV !== 'production') {
        console.warn('\n⚠️ MODO DESARROLLO - No usar en producción');
      }
    });

    // Cierre limpio
    process.on('SIGINT', async () => {
      console.log('\n🔻 Cerrando servidor (SIGINT)...');
      await sequelize.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('\n❌ ERROR INICIALIZACIÓN:', error);
    console.error('\n🔧 Soluciones:');
    console.error('1. Verificar credenciales en .env');
    console.error('2. Comprobar estado de MariaDB/MySQL');
    console.error('3. Validar permisos de usuario en DB');
    process.exit(1);
  }
};

startServer();