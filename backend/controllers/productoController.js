//backend/controllers/productoController.js
const { Producto } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

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
      where.categoria = { [Op.like]: `%${categoria}%` };
    }

    const productos = await Producto.findAll({ where });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProducto = async (req, res) => {
  const { nombre, precio, stock } = req.body;

  try {
    // 1. Validaciones mejoradas
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ 
        message: 'El nombre es obligatorio' 
      });
    }

    if (precio === undefined || precio === null || isNaN(precio)) {
      return res.status(400).json({ 
        message: 'El precio debe ser un número válido' 
      });
    }

    const precioNum = parseFloat(precio);
    if (precioNum <= 0) {
      return res.status(400).json({ 
        message: 'El precio debe ser mayor que cero' 
      });
    }

    // 2. Búsqueda case-insensitive segura
    const existente = await Producto.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('nombre')), 
        sequelize.fn('LOWER', nombre)
      )
    });

    if (existente) {
      return res.status(409).json({ 
        message: 'Ya existe un producto con ese nombre' 
      });
    }

    // 3. Crear producto con valores limpios
    const nuevoProducto = await Producto.create({
      nombre: nombre.trim(),
      precio: precioNum,
      stock: stock ? parseInt(stock, 10) : 0,
      descripcion: req.body.descripcion || null,
      categoria: req.body.categoria || null
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('🔥 Error en createProducto:', error);
    
    // Manejo de errores específicos de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    // Manejo de errores de base de datos
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({ 
        message: 'Error de base de datos',
        detail: process.env.NODE_ENV !== 'production' ? error.message : null
      });
    }

    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV !== 'production' ? error.message : null
    });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const { nombre } = req.body;

    // Validar precio si se actualiza
    if (req.body.precio !== undefined && parseFloat(req.body.precio) <= 0) {
      return res.status(400).json({ 
        message: 'El precio debe ser mayor que cero' 
      });
    }

    // Verificar duplicados por nombre (excluyendo el actual)
    if (nombre) {
      const existente = await Producto.findOne({ 
        where: { 
          nombre: { 
            [Op.iLike]: nombre 
          },
          id: { [Op.ne]: id }
        } 
      });
      
      if (existente) {
        return res.status(409).json({ 
          message: 'Ya existe otro producto con ese nombre' 
        });
      }
    }

    await producto.update(req.body);
    res.json(producto);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Producto.destroy({ where: { id } });

    if (eliminado) {
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    // Manejar error si el producto está asociado a facturas
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ 
        message: 'No se puede eliminar, el producto está asociado a facturas' 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

