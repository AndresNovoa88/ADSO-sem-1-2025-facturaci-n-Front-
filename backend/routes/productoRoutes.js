const express = require('express');
const router = express.Router();
const db = require('../app'); // Importamos la conexión

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Crear un nuevo producto
router.post('/', (req, res) => {
  const { nombre, precio } = req.body;
  db.query(
    'INSERT INTO productos (nombre, precio) VALUES (?, ?)',
    [nombre, precio],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, nombre, precio });
    }
  );
});

module.exports = router;