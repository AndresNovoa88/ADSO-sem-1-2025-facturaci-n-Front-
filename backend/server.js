require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { User } = require('./models/User');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// Sincronización de modelos
sequelize.sync({ force: true })
  .then(() => console.log('Modelos sincronizados'))
  .catch(err => console.error('Error sincronizando modelos:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});