const { DetalleFactura, Factura, Producto } = require('../models');
const { sequelize } = require('../models');
exports.getDetallesByFactura = async (req, res) => {
  try {
    const { facturaId } = req.params;
    
    // Verificar que la factura existe
    const factura = await Factura.findByPk(facturaId);
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    // Obtener detalles con información del producto
    const detalles = await DetalleFactura.findAll({
      where: { factura_id: facturaId },
      include: {
        model: Producto,
        attributes: ['id', 'nombre', 'descripcion', 'categoria']
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDetalleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const detalle = await DetalleFactura.findByPk(id, {
      include: [
        {
          model: Factura,
          attributes: ['id', 'codigo', 'fecha', 'total']
        },
        {
          model: Producto,
          attributes: ['id', 'nombre', 'precio', 'categoria']
        }
      ]
    });
    
    if (!detalle) {
      return res.status(404).json({ error: 'Detalle no encontrado' });
    }
    
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addDetalleToFactura = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { facturaId } = req.params;
    const { producto_id, cantidad } = req.body;
    
    // Validar que la factura existe y está activa
    const factura = await Factura.findByPk(facturaId, { transaction });
    if (!factura) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    if (factura.estado !== 'PENDIENTE') {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'No se pueden agregar detalles a una factura anulada o procesada' 
      });
    }
    
    // Validar el producto
    const producto = await Producto.findByPk(producto_id, { transaction });
    if (!producto) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    if (producto.stock < cantidad) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: `Stock insuficiente para el producto ${producto.nombre}` 
      });
    }
    
    // Calcular subtotal
    const precio_unitario = producto.precio;
    const subtotal = precio_unitario * cantidad;
    
    // Crear el detalle
    const detalle = await DetalleFactura.create({
      factura_id: facturaId,
      producto_id,
      cantidad,
      precio_unitario,
      subtotal
    }, { transaction });
    
    // Actualizar stock del producto
    await Producto.decrement('stock', {
      by: cantidad,
      where: { id: producto_id },
      transaction
    });
    
    // Recalcular totales de la factura
    const detalles = await DetalleFactura.findAll({
      where: { factura_id: facturaId },
      transaction
    });
    
    const newSubtotal = detalles.reduce((sum, item) => sum + item.subtotal, 0);
    const newImpuesto = newSubtotal * 0.19; // 19% IVA
    const newTotal = newSubtotal + newImpuesto;
    
    await Factura.update({
      subtotal: newSubtotal,
      impuesto: newImpuesto,
      total: newTotal
    }, {
      where: { id: facturaId },
      transaction
    });
    
    await transaction.commit();
    res.status(201).json(detalle);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.updateDetalle = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { cantidad } = req.body;
    
    // Obtener el detalle actual
    const detalle = await DetalleFactura.findByPk(id, { transaction });
    if (!detalle) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Detalle no encontrado' });
    }
    
    // Validar la factura asociada
    const factura = await Factura.findByPk(detalle.factura_id, { transaction });
    if (!factura || factura.estado !== 'PENDIENTE') {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'No se puede modificar un detalle de factura anulada o procesada' 
      });
    }
    
    // Obtener el producto
    const producto = await Producto.findByPk(detalle.producto_id, { transaction });
    
    // Calcular diferencia de cantidad
    const diferencia = cantidad - detalle.cantidad;
    
    // Validar stock si se aumenta la cantidad
    if (diferencia > 0 && producto.stock < diferencia) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: `Stock insuficiente para el producto ${producto.nombre}` 
      });
    }
    
    // Actualizar el detalle
    const newSubtotal = detalle.precio_unitario * cantidad;
    await detalle.update({
      cantidad,
      subtotal: newSubtotal
    }, { transaction });
    
    // Ajustar stock del producto
    if (diferencia !== 0) {
      await Producto.increment('stock', {
        by: -diferencia,
        where: { id: producto.id },
        transaction
      });
    }
    
    // Recalcular totales de la factura
    const detalles = await DetalleFactura.findAll({
      where: { factura_id: factura.id },
      transaction
    });
    
    const updatedSubtotal = detalles.reduce((sum, item) => sum + item.subtotal, 0);
    const updatedImpuesto = updatedSubtotal * 0.19;
    const updatedTotal = updatedSubtotal + updatedImpuesto;
    
    await Factura.update({
      subtotal: updatedSubtotal,
      impuesto: updatedImpuesto,
      total: updatedTotal
    }, {
      where: { id: factura.id },
      transaction
    });
    
    await transaction.commit();
    res.json(await DetalleFactura.findByPk(id));
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.deleteDetalle = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    
    // Obtener el detalle
    const detalle = await DetalleFactura.findByPk(id, { transaction });
    if (!detalle) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Detalle no encontrado' });
    }
    
    // Validar la factura asociada
    const factura = await Factura.findByPk(detalle.factura_id, { transaction });
    if (!factura || factura.estado !== 'PENDIENTE') {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'No se puede eliminar un detalle de factura anulada o procesada' 
      });
    }
    
    // Obtener el producto
    const producto = await Producto.findByPk(detalle.producto_id, { transaction });
    
    // Eliminar el detalle
    await detalle.destroy({ transaction });
    
    // Restaurar stock del producto
    await Producto.increment('stock', {
      by: detalle.cantidad,
      where: { id: producto.id },
      transaction
    });
    
    // Recalcular totales de la factura
    const detalles = await DetalleFactura.findAll({
      where: { factura_id: factura.id },
      transaction
    });
    
    const newSubtotal = detalles.reduce((sum, item) => sum + item.subtotal, 0);
    const newImpuesto = newSubtotal * 0.19;
    const newTotal = newSubtotal + newImpuesto;
    
    await Factura.update({
      subtotal: newSubtotal,
      impuesto: newImpuesto,
      total: newTotal
    }, {
      where: { id: factura.id },
      transaction
    });
    
    await transaction.commit();
    res.json({ message: 'Detalle eliminado correctamente' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};