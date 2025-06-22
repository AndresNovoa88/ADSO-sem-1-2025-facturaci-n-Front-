const { Vendedor } = require('../models');
const { Op } = require('sequelize');

exports.getAllVendedores = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { apellido: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const vendedores = await Vendedor.findAll({ where });
    res.json(vendedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVendedorById = async (req, res) => {
  try {
    const vendedor = await Vendedor.findByPk(req.params.id);
    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }
    res.json(vendedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createVendedor = async (req, res) => {
  try {
    console.log('📥 Datos recibidos:', req.body); // Agregar log
    
    // Validar cuota de ventas
    if (req.body.cuota_ventas && req.body.cuota_ventas < 0) {
      return res.status(400).json({ error: 'La cuota de ventas no puede ser negativa' });
    }
    
    console.log('🔁 Intentando crear vendedor...');
    const vendedor = await Vendedor.create(req.body);
    console.log('✅ Vendedor creado:', vendedor.toJSON());
    
    res.status(201).json(vendedor);
  } catch (error) {
    console.error('❌ Error al crear vendedor:', error);
    
    // Manejo de errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ errors });
    }
    
    res.status(400).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.updateVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Vendedor.update(req.body, { where: { id } });
    
    if (updated) {
      const updatedVendedor = await Vendedor.findByPk(id);
      res.json(updatedVendedor);
    } else {
      res.status(404).json({ error: 'Vendedor no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Vendedor.destroy({ where: { id } });
    
    if (deleted) {
      res.json({ message: 'Vendedor eliminado' });
    } else {
      res.status(404).json({ error: 'Vendedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};