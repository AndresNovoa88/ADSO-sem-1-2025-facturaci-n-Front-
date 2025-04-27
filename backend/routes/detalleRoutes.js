const express = require('express');
const router = express.Router();
const detalleController = require('../controllers/detalleController');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

// Obtener detalles de una factura
router.get('/factura/:facturaId', 
  authMiddleware, 
  detalleController.getDetallesByFactura
);

// Obtener un detalle específico
router.get('/:id', 
  authMiddleware, 
  detalleController.getDetalleById
);

// Agregar detalle a una factura
router.post('/factura/:facturaId', 
  authMiddleware, 
  checkRole(['Vendedor', 'Gerente']), 
  detalleController.addDetalleToFactura
);

// Actualizar un detalle
router.put('/:id', 
  authMiddleware, 
  checkRole(['Vendedor', 'Gerente']), 
  detalleController.updateDetalle
);

// Eliminar un detalle
router.delete('/:id', 
  authMiddleware, 
  checkRole(['Vendedor', 'Gerente']), 
  detalleController.deleteDetalle
);

module.exports = router;