const express = require('express');
const router = express.Router();
const vendedorController = require('../controllers/vendedorController');
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/checkRole');

router.get('/', authMiddleware, vendedorController.getAllVendedores);
router.get('/:id', authMiddleware, vendedorController.getVendedorById);
router.post('/', authMiddleware, checkRole(['Administrador', 'Gerente']), vendedorController.createVendedor);
router.put('/:id', authMiddleware, checkRole(['Administrador', 'Gerente']), vendedorController.updateVendedor);
router.delete('/:id', authMiddleware, checkRole(['Administrador']), vendedorController.deleteVendedor);

module.exports = router;