const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const productoRoutes = require("./routes/productoRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario', // Usualmente 'root' en desarrollo local
  password: 'tu_contraseña',
  database: 'facturacion_sena'
});

// Conectar a MySQL
db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Rutas
app.use("/api/productos", productoRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Exportar la conexión para usarla en otras partes
module.exports = db;