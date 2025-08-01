const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, facturaController.getAllFacturas);
router.get('/:id', authMiddleware, facturaController.getFacturaById);
router.get('/pdf/:codigo', authMiddleware, facturaController.getFacturaPDF);
router.post('/', authMiddleware, facturaController.createFactura);
router.put('/:id/anular', authMiddleware, facturaController.anularFactura);
router.get('/cliente/search', authMiddleware, facturaController.searchFacturasByCliente);
router.delete('/:id', authMiddleware, facturaController.deleteFactura);

module.exports = router;