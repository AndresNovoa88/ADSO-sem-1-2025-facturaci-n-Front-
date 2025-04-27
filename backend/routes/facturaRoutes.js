const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.get('/', authMiddleware, facturaController.getAllFacturas);
router.get('/:id', authMiddleware, facturaController.getFacturaById);
router.post('/', authMiddleware, checkRole(['Vendedor', 'Gerente']), facturaController.createFactura);
router.put('/:id/anular', authMiddleware, checkRole(['Gerente', 'Administrador']), facturaController.anularFactura);

module.exports = router;