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
  const { nombre } = req.body;

  try {
    const existente = await Producto.findOne({ where: { nombre } });
    if (existente) {
      return res.status(400).json({ message: '❌ El producto ya existe' });
    }

    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Error al crear el producto' });
  }
};

exports.updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Producto.update(req.body, { where: { id } });

    if (updated) {
      const productoActualizado = await Producto.findByPk(id);
      res.json(productoActualizado);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Producto.destroy({ where: { id } });

    if (eliminado) {
      res.json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

