const { Producto } = require('../models');
const { Op } = require('sequelize');

exports.getAllProductos = async (req, res) => {
  try {
    const { search, categoria } = req.query;
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (categoria) {
      where.categoria = categoria;
    }
    
    const productos = await Producto.findAll({ where });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProducto = async (req, res) => {
  try {
    // Validar precio y stock
    if (req.body.precio <= 0 || req.body.stock < 0) {
      return res.status(400).json({ 
        error: 'Precio debe ser mayor a 0 y stock no puede ser negativo' 
      });
    }
    
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ... (métodos update y delete similares a vendedorController)const { Producto } = require('../models');
const { Op } = require('sequelize');

exports.getAllProductos = async (req, res) => {
  try {
    const { search, categoria } = req.query;
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (categoria) {
      where.categoria = categoria;
    }
    
    const productos = await Producto.findAll({ where });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProducto = async (req, res) => {
  try {
    // Validar precio y stock
    if (req.body.precio <= 0 || req.body.stock < 0) {
      return res.status(400).json({ 
        error: 'Precio debe ser mayor a 0 y stock no puede ser negativo' 
      });
    }
    
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ... (métodos update y delete similares a vendedorController)