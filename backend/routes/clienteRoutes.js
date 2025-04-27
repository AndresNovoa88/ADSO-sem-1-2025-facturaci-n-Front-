const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, clienteController.getAllClientes);
router.post('/', authMiddleware, clienteController.createCliente);
router.put('/:id', authMiddleware, clienteController.updateCliente);
router.delete('/:id', authMiddleware, clienteController.deleteCliente);

module.exports = router;