require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const morgan = require('morgan');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const vendedorRoutes = require('./routes/vendedorRoutes');
const productoRoutes = require('./routes/productoRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const detalleRoutes = require('./routes/detalleRoutes');

// Configuración inicial
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logger para desarrollo

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/vendedores', vendedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/detalles', detalleRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API FacturaSENA funcionando' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Sincronizar modelos y arrancar servidor
sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos conectada y modelos sincronizados');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });

module.exports = app;