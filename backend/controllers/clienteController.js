const Cliente = require('../models/Cliente');
const { sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCliente = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido) {
      return res.status(400).json({
        message: 'Nombre y apellido son campos obligatorios'
      });
    }

    // Validar duplicados: nombre + apellido
    const existingName = await Cliente.findOne({ 
      where: { nombre, apellido } 
    });
    
    if (existingName) {
      return res.status(400).json({
        message: 'Ya existe un cliente con el mismo nombre y apellido'
      });
    }

    // Validar duplicados: teléfono
    if (telefono) {
      const existingPhone = await Cliente.findOne({ 
        where: { telefono } 
      });
      
      if (existingPhone) {
        return res.status(400).json({
          message: 'El número de teléfono ya está registrado'
        });
      }
    }

    // Validar duplicados: email
    if (email) {
      const existingEmail = await Cliente.findOne({ 
        where: { email } 
      });
      
      if (existingEmail) {
        return res.status(400).json({
          message: 'El correo electrónico ya está registrado'
        });
      }
    }

    const nuevoCliente = await Cliente.create(req.body);
    res.status(201).json(nuevoCliente);
    
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    const { nombre, apellido, telefono, email } = req.body;

    // Validar duplicados (excluyendo el actual)
    if (nombre && apellido) {
      const existingName = await Cliente.findOne({ 
        where: { 
          nombre, 
          apellido,
          id: { [Op.ne]: id } // Excluir el registro actual
        }
      });
      
      if (existingName) {
        return res.status(400).json({
          message: 'Ya existe otro cliente con el mismo nombre y apellido'
        });
      }
    }

    if (telefono) {
      const existingPhone = await Cliente.findOne({ 
        where: { 
          telefono,
          id: { [Op.ne]: id }
        }
      });
      
      if (existingPhone) {
        return res.status(400).json({
          message: 'El número de teléfono ya está registrado en otro cliente'
        });
      }
    }

    if (email) {
      const existingEmail = await Cliente.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: id }
        }
      });
      
      if (existingEmail) {
        return res.status(400).json({
          message: 'El correo electrónico ya está registrado en otro cliente'
        });
      }
    }

    await cliente.update(req.body);
    res.json(cliente);
    
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cliente.destroy({ where: { id } });
    
    if (deleted) {
      res.json({ message: 'Cliente eliminado' });
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};