const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.get('/', authMiddleware, facturaController.getAllFacturas);
router.get('/:id', authMiddleware, facturaController.getFacturaById);
router.post('/', authMiddleware, facturaController.createFactura);
 //checkRole(['Vendedor', 'Gerente']),
router.put('/:id/anular', authMiddleware, facturaController.anularFactura);
//checkRole(['Gerente', 'Administrador']),

module.exports = router;