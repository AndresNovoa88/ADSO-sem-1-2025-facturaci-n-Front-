const { Factura, Cliente, Vendedor, Producto, DetalleFactura, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ==================== FUNCIONES AUXILIARES ====================
const generateFacturaNumber = async () => {
  const lastFactura = await Factura.findOne({
    order: [['id', 'DESC']],
    attributes: ['codigo']
  });
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  let sequence = 1;
  if (lastFactura) {
    const lastNumber = lastFactura.codigo.split('-');
    if (lastNumber[0] === `${year}${month}`) {
      sequence = parseInt(lastNumber[1]) + 1;
    }
  }
  
  return `${year}${month}-${String(sequence).padStart(6, '0')}`;
};

const prepareFacturaPDF = (doc, factura, cliente, vendedor) => {
  // Encabezado
  doc.image(path.join(__dirname, '../public/logo.png'), 50, 45, { width: 100 });
  doc.fontSize(20).text('FACTURA DE VENTA', 200, 50, { align: 'center' });
  doc.fontSize(12).text(`No. ${factura.codigo}`, 200, 80, { align: 'center' });
  
  // Datos de la empresa
  doc.fontSize(10)
    .text('SENA Facturación', 50, 120)
    .text('Nit: 123456789-0', 50, 135)
    .text('Dirección: Cra 10 #20-30, Ibagué', 50, 150)
    .text(`Fecha: ${new Date(factura.fecha).toLocaleDateString()}`, 50, 165);
  
  // Datos del cliente
  doc.fontSize(10)
    .text('Cliente:', 350, 120)
    .text(`${cliente.nombre} ${cliente.apellido}`, 350, 135)
    .text(`Nit/CC: ${cliente.identificacion || 'No especificado'}`, 350, 150)
    .text(`Dirección: ${cliente.direccion || 'No especificada'}`, 350, 165);
  
  // Línea separadora
  doc.moveTo(50, 190).lineTo(550, 190).stroke();
};

const generateProductosTable = async (doc, detalles, yPosition) => {
  doc.fontSize(12).text('Detalle de la Factura', 50, yPosition);
  let y = yPosition + 30;
  
  // Encabezados de tabla
  doc.fontSize(10);
  doc.text('Código', 50, y);
  doc.text('Descripción', 120, y);
  doc.text('Cantidad', 300, y, { width: 50, align: 'right' });
  doc.text('P. Unitario', 370, y, { width: 60, align: 'right' });
  doc.text('Subtotal', 450, y, { width: 60, align: 'right' });
  
  y += 20;
  
  // Productos
  for (const detalle of detalles) {
    const producto = await Producto.findByPk(detalle.producto_id);
    
    doc.text(producto.id.toString(), 50, y);
    doc.text(producto.nombre, 120, y, { width: 170 });
    doc.text(detalle.cantidad.toString(), 300, y, { width: 50, align: 'right' });
    doc.text(`$${detalle.precio_unitario.toFixed(2)}`, 370, y, { width: 60, align: 'right' });
    doc.text(`$${detalle.subtotal.toFixed(2)}`, 450, y, { width: 60, align: 'right' });
    
    y += 25;
  }
  
  return y;
};

const generateTotalsSection = (doc, factura, yPosition) => {
  doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
  let y = yPosition + 20;
  
  doc.font('Helvetica-Bold')
    .text('Subtotal:', 370, y, { width: 60, align: 'right' })
    .text(`$${factura.subtotal.toFixed(2)}`, 450, y, { width: 60, align: 'right' });
  
  y += 20;
  
  doc.text('IVA (19%):', 370, y, { width: 60, align: 'right' })
    .text(`$${factura.impuesto.toFixed(2)}`, 450, y, { width: 60, align: 'right' });
  
  y += 20;
  
  doc.fontSize(12)
    .text('TOTAL:', 370, y, { width: 60, align: 'right' })
    .text(`$${factura.total.toFixed(2)}`, 450, y, { width: 60, align: 'right' });
  
  // Pie de página
  y += 40;
  doc.fontSize(8)
    .text('Gracias por su compra', 50, y, { align: 'center' })
    .text('Este documento es válido como factura de venta', 50, y + 15, { align: 'center' });
};

// ==================== CONTROLADORES PRINCIPALES ====================
exports.getAllFacturas = async (req, res) => {
  try {
    const { startDate, endDate, cliente, vendedor, estado, search } = req.query;
    const where = {};
    
    // Filtros de fecha
    if (startDate || endDate) {
      where.fecha = {};
      if (startDate) where.fecha[Op.gte] = new Date(startDate);
      if (endDate) where.fecha[Op.lte] = new Date(endDate);
    }
    
    // Filtros adicionales
    if (estado) where.estado = estado;
    if (cliente) where.cliente_id = cliente;
    if (vendedor) where.vendedor_id = vendedor;
    
    // Filtro de búsqueda por nombre de cliente
    if (search && search.length >= 3) {
      where[Op.or] = [
        { '$Cliente.nombre$': { [Op.iLike]: `%${search}%` } },
        { '$Cliente.apellido$': { [Op.iLike]: `%${search}%` } },
        { codigo: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Restricción para vendedores
    if (req.user.rol_id === 3) {
      where.vendedor_id = req.user.id;
    }
    
    const facturas = await Factura.findAll({
      where,
      include: [
        { 
          model: Cliente, 
          attributes: ['id', 'nombre', 'apellido'],
        },
        { 
          model: Vendedor, 
          attributes: ['id', 'nombre', 'apellido'],
        }
      ],
      order: [['fecha', 'DESC']]
    });
    
    res.json(facturas);
  } catch (error) {
    console.error('Error en getAllFacturas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getFacturaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const factura = await Factura.findByPk(id, {
      include: [
        { 
          model: Cliente,
          attributes: ['id', 'nombre', 'apellido', 'direccion', 'telefono', 'email']
        },
        { 
          model: Vendedor,
          attributes: ['id', 'nombre', 'apellido', 'telefono', 'email']
        },
        {
          model: DetalleFactura,
          include: [{
            model: Producto,
            attributes: ['id', 'nombre', 'descripcion', 'categoria']
          }]
        },
        { 
          model: Usuario, 
          as: 'Creador',
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    // Verificar permisos
    if (req.user.rol_id === 3 && factura.vendedor_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFactura = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { cliente_id, vendedor_id, items, observaciones, estado } = req.body;
    
    // Validaciones básicas
    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'La factura debe tener al menos un item' });
    }
    
    // Generar número de factura
    const codigo = await generateFacturaNumber();
    
    // Validar cliente y vendedor
    const [cliente, vendedor] = await Promise.all([
      Cliente.findByPk(cliente_id, { transaction }),
      Vendedor.findByPk(vendedor_id, { transaction })
    ]);
    
    if (!cliente || !vendedor) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Cliente o vendedor no encontrado' });
    }
    
    // Validar productos y stock
    const productos = await Producto.findAll({
      where: { id: { [Op.in]: items.map(item => item.producto_id) } },
      transaction
    });
    
    const productosMap = productos.reduce((map, producto) => {
      map[producto.id] = producto;
      return map;
    }, {});
    
    let subtotal = 0;
    const detalles = [];
    
    for (const item of items) {
      const producto = productosMap[item.producto_id];
      
      if (!producto) {
        await transaction.rollback();
        return res.status(404).json({ error: `Producto con ID ${item.producto_id} no encontrado` });
      }
      
      if (producto.stock < item.cantidad) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: `Stock insuficiente para ${producto.nombre}`,
          productoId: producto.id,
          stockDisponible: producto.stock,
          cantidadSolicitada: item.cantidad
        });
      }
      
      const precio = producto.precio;
      const itemSubtotal = precio * item.cantidad;
      subtotal += itemSubtotal;
      
      detalles.push({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: precio,
        subtotal: itemSubtotal
      });
      
      // Actualizar stock
      await Producto.decrement('stock', {
        by: item.cantidad,
        where: { id: item.producto_id },
        transaction
      });
    }
    
    const impuesto = subtotal * 0.19;
    const total = subtotal + impuesto;
    
    // Crear factura
    const factura = await Factura.create({
      codigo,
      cliente_id,
      vendedor_id,
      subtotal,
      impuesto,
      total,
      observaciones,
      estado,
    }, { transaction });
    
    // Crear detalles
    for (const detalle of detalles) {
      await DetalleFactura.create({
        ...detalle,
        factura_id: factura.id
      }, { transaction });
    }
    
    // Generar PDF en segundo plano
    setTimeout(async () => {
      try {
        await exports.generatePDF(factura, detalles, cliente, vendedor);
      } catch (pdfError) {
        console.error('Error generando PDF:', pdfError);
      }
    }, 1000);
    
    await transaction.commit();
    res.status(201).json(factura);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.anularFactura = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    // Validar factura
    const factura = await Factura.findByPk(id, { 
      include: [DetalleFactura],
      transaction 
    });
    
    if (!factura) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    if (factura.estado !== 'PENDIENTE') {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Solo se pueden anular facturas pendientes' 
      });
    }
    
    // Verificar permisos
    if (![1, 2].includes(req.user.rol_id)) {
      await transaction.rollback();
      return res.status(403).json({ error: 'No tienes permisos para anular' });
    }
    
    // Revertir stock
    for (const detalle of factura.DetalleFacturas) {
      await Producto.increment('stock', {
        by: detalle.cantidad,
        where: { id: detalle.producto_id },
        transaction
      });
    }
    
    // Actualizar estado
    await factura.update({
      estado: 'ANULADA',
      motivo_anulacion: motivo || 'Anulada por el administrador'
    }, { transaction });
    
    await transaction.commit();
    res.json(factura);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.generatePDF = async (factura, detalles, cliente, vendedor) => {
  try {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, '../facturas', `${factura.codigo}.pdf`);
    
    // Crear directorio si no existe
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    
    // Construir PDF
    prepareFacturaPDF(doc, factura, cliente, vendedor);
    const yPosition = await generateProductosTable(doc, detalles, 200);
    generateTotalsSection(doc, factura, yPosition);
    
    doc.end();
    
    // Guardar referencia en BD
    await Factura.update(
      { pdf_path: `/facturas/${factura.codigo}.pdf` },
      { where: { id: factura.id } }
    );
    
    return new Promise((resolve) => {
      writeStream.on('finish', () => resolve(filePath));
    });
  } catch (error) {
    console.error('Error generando PDF:', error);
    return null;
  }
};

exports.getFacturaPDF = async (req, res) => {
  try {
    const { codigo } = req.params;
    const factura = await Factura.findOne({ 
      where: { codigo },
      include: [
        { model: Cliente },
        { model: Vendedor },
        { 
          model: DetalleFactura,
          include: [{ model: Producto }]
        }
      ]
    });

    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    // Verificar permisos
    if (req.user.rol_id === 3 && factura.vendedor_id !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Si el PDF ya existe, servirlo directamente
    if (factura.pdf_path) {
      const filePath = path.join(__dirname, '..', factura.pdf_path);
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=${codigo}.pdf`);
        return fs.createReadStream(filePath).pipe(res);
      }
    }

    // Generar PDF si no existe
    const filePath = await exports.generatePDF(
      factura, 
      factura.DetalleFacturas, 
      factura.Cliente, 
      factura.Vendedor
    );

    if (!filePath) {
      return res.status(500).json({ error: 'Error generando PDF' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${codigo}.pdf`);
    fs.createReadStream(filePath).pipe(res);
    
  } catch (error) {
    console.error('Error en getFacturaPDF:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.searchFacturasByCliente = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name || name.length < 3) {
      return res.status(400).json({ error: 'Debe proporcionar al menos 3 caracteres' });
    }
    
    const facturas = await Factura.findAll({
      include: [
        {
          model: Cliente,
          where: {
            [Op.or]: [
              { nombre: { [Op.like]: `%${name}%` } },
              { apellido: { [Op.like]: `%${name}%` } }
            ]
          },
          attributes: ['id', 'nombre', 'apellido', 'identificacion'],
          required: true // Añadir esto
        },
        { 
          model: Vendedor, 
          attributes: ['id', 'nombre', 'apellido'],
          required: true
        },
        { 
          model: DetalleFactura,
          include: [{ model: Producto, attributes: ['id', 'nombre'] }]
        }
      ],
      order: [['fecha', 'DESC']]
    });
    
    res.json(facturas);
  } catch (error) {
    console.error('Error en searchFacturasByCliente:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFactura = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    
    // Buscar la factura con sus detalles
    const factura = await Factura.findByPk(id, {
      include: [{
        model: DetalleFactura,
        as: 'DetalleFacturas'
      }],
      transaction
    });
    
    if (!factura) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    
    // Solo se pueden eliminar facturas pendientes
    if (factura.estado !== 'PENDIENTE') {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Solo se pueden eliminar facturas pendientes' 
      });
    }
    
    // Revertir stock de productos
    for (const detalle of factura.DetalleFacturas) {
      await Producto.increment('stock', {
        by: detalle.cantidad,
        where: { id: detalle.producto_id },
        transaction
      });
    }
    
    // Eliminar detalles de la factura
    await DetalleFactura.destroy({
      where: { factura_id: factura.id },
      transaction
    });
    
    // Eliminar la factura
    await factura.destroy({ transaction });
    
    await transaction.commit();
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error en deleteFactura:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.generarPDF = async (req, res) => {
  try {
    const { codigo } = req.params;

    const factura = await Factura.findOne({
      where: { codigo },
      include: [
        { model: Cliente },
        { model: Vendedor },
        {
          model: DetalleFactura,
          include: [Producto]
        }
      ]
    });

    if (!factura) {
      return res.status(404).send('Factura no encontrada');
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=factura_${codigo}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text(`Factura: ${factura.codigo}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Fecha: ${factura.fecha}`);
    doc.text(`Cliente: ${factura.Cliente.nombre} ${factura.Cliente.apellido}`);
    doc.text(`Vendedor: ${factura.Vendedor.nombre} ${factura.Vendedor.apellido}`);
    doc.moveDown();

    doc.text('Detalle de productos:');
    factura.DetalleFacturas.forEach((detalle) => {
      doc.text(` - ${detalle.Producto.nombre}: ${detalle.cantidad} x $${detalle.precio_unitario}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: $${factura.subtotal}`);
    doc.text(`Impuesto: $${factura.impuesto}`);
    doc.text(`Total: $${factura.total}`);
    doc.end();
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
};
