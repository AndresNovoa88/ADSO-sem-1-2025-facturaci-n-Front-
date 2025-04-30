require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const facturaRoutes = require('./routes/facturaRoutes');

const app = express();

// Middlewares esenciales
app.use(cors({
  origin: 'http://localhost:3000', // Asegurar CORS
  credentials: true
}));
app.use(express.json());

// Configuración de rutas
app.use('/api/auth', authRoutes);
app.use('/api/facturas', facturaRoutes);

// Sincronización segura de modelos
const initializeServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a DB exitosa');
    
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');
    
    // Inicializar datos esenciales
    await require('./seeders/initialRoles')();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error de inicialización:', error);
    process.exit(1);
  }
};

initializeServer();