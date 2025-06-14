//backend/routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, productoController.getAllProductos);
router.get('/:id', authMiddleware, productoController.getProductoById);
router.post('/', authMiddleware, productoController.createProducto);
router.put('/:id', authMiddleware, productoController.updateProducto);
router.delete('/:id', authMiddleware, productoController.deleteProducto);

module.exports = router;
