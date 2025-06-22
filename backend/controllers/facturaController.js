const { Factura, Cliente, Vendedor, Producto, DetalleFactura, Usuario, sequelize } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Configuración para DIAN (ejemplo)
/*const DIAN_CONFIG = {
  apiUrl: process.env.DIAN_API_URL || 'https://api.dian.gov.co/v1',
  apiKey: process.env.DIAN_API_KEY,
  testMode: process.env.NODE_ENV !== 'production'
}; */

exports.generateFacturaNumber = async () => {
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

exports.getAllFacturas = async (req, res) => {
  try {
    const { startDate, endDate, cliente, vendedor, estado } = req.query;
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
    
    // Restricción para vendedores (solo ven sus facturas)
    if (req.user.rol_id === 3) { // Rol de vendedor
      where.vendedor_id = req.user.id;
    }
    
    const facturas = await Factura.findAll({
      where,
      include: [
        { model: Cliente, attributes: ['id', 'nombre', 'apellido'] },
        { model: Vendedor, attributes: ['id', 'nombre', 'apellido'] },
        { model: Usuario, as: 'Creador', attributes: ['id', 'username'] }
      ],
      order: [['fecha', 'DESC']]
    });
    
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    
    // Verificar permisos (vendedor solo puede ver sus facturas)
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
    console.log('📦 Body recibido en createFactura:', req.body);
    
    // Validaciones básicas
    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'La factura debe tener al menos un item' });
    }
    
    // Generar número de factura
    const codigo = await exports.generateFacturaNumber();
    
    // Validar cliente y vendedor
    const [cliente, vendedor] = await Promise.all([
      Cliente.findByPk(cliente_id, { transaction }),
      Vendedor.findByPk(vendedor_id, { transaction })
    ]);
    
    if (!cliente || !vendedor) {
      await transaction.rollback();
      return res.status(404).json({ 
        error: 'Cliente o vendedor no encontrado' 
      });
    }
    console.log('🔐 Usuario autenticado:', req.user);
    
    // Validar productos y stock
    console.log('🧺 Items recibidos (productos a facturar):', items);
    const productos = await Producto.findAll({
      where: { 
        id: { [Op.in]: items.map(item => item.producto_id) } 
      },
      transaction
    });
    
    const productosMap = productos.reduce((map, producto) => {
      map[producto.id] = producto;
      return map;
    }, {});
    
    for (const item of items) {
      const producto = productosMap[item.producto_id];
      
      if (!producto) {
        await transaction.rollback();
        return res.status(404).json({ 
          error: `Producto con ID ${item.producto_id} no encontrado` 
        });
      }
      
      if (producto.stock < item.cantidad) {
        await transaction.rollback();
        return res.status(400).json({ 
          error: `Stock insuficiente para el producto ${producto.nombre}`,
          productoId: producto.id,
          stockDisponible: producto.stock,
          cantidadSolicitada: item.cantidad
        });
      }
    }
    
    // Calcular totales
    let subtotal = 0;
    const detalles = [];
    
    for (const item of items) {
      const producto = productosMap[item.producto_id];
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
    
    const impuesto = subtotal * 0.19; // 19% de IVA
    const total = subtotal + impuesto;
    
    // Crear factura
    console.log('🧾 Datos a insertar en Factura:', {
  cliente_id,
  vendedor_id,
  subtotal,
  impuesto,
  total,
  estado,
  observaciones
});
console.log('🧾 Datos para Factura.create:', {
      codigo, cliente_id, vendedor_id, subtotal, impuesto, total, estado, observaciones
    });
    const factura = await Factura.create({
      codigo,
      cliente_id,
      vendedor_id,
      subtotal,
      impuesto,
      total,
      observaciones,
      estado,
      creado_por: req.user.id
    }, { transaction });
    
    // Crear detalles de factura
    for (const detalle of detalles) {
      await DetalleFactura.create({
        ...detalle,
        factura_id: factura.id
      }, { transaction });
    }
    
    // Integración con DIAN (ejemplo - preparación)
    /*
    if (DIAN_CONFIG.apiKey) {
      try {
        const dianPayload = this.prepareDIANPayload(factura, detalles, cliente, vendedor);
        await this.sendToDIAN(dianPayload, transaction);
      } catch (dianError) {
        console.error('Error enviando a DIAN:', dianError);
        // No hacemos rollback por error en DIAN, solo log
      }
    }
      */
    
    await transaction.commit();
    
    // Generar PDF (async - no bloquea la respuesta)
    //this.generatePDF(factura, detalles, cliente, vendedor);
    
    // Posible integración con IA para análisis
    //this.analyzeWithAI(factura, detalles);
    
    res.status(201).json(factura);
  } catch (error) {
    console.error('🔥 [createFactura] Error capturado:', error);
    console.error('🔥 [createFactura] Error.message:', error.message);
    await transaction.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.anularFactura = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    // Validar que la factura existe y está pendiente
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
        error: 'Solo se pueden anular facturas en estado PENDIENTE' 
      });
    }
    
    // Verificar permisos (solo admin y gerente pueden anular)
    if (![1, 2].includes(req.user.rol_id)) {
      await transaction.rollback();
      return res.status(403).json({ 
        error: 'No tienes permisos para anular facturas' 
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
    
    // Actualizar estado de la factura
    await factura.update({
      estado: 'ANULADA',
      motivo_anulacion: motivo || 'Anulada por el administrador'
    }, { transaction });
    
    // Notificar a DIAN si está habilitado
    /* if (DIAN_CONFIG.apiKey) {
      try {
        await this.notifyDIANCancellation(factura.codigo, motivo);
      } catch (dianError) {
        console.error('Error notificando anulación a DIAN:', dianError);
      }
    } */
    
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
    
    // Detalles de la factura
    doc.fontSize(12).text('Detalle de la Factura', 50, 200);
    
    // Tabla de productos
    let y = 230;
    doc.fontSize(10);
    
    // Encabezados de tabla
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
    
    // Totales
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 20;
    
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
    
    doc.end();
    
    // Guardar referencia del PDF en la base de datos
    await Factura.update(
      { pdf_path: `/facturas/${factura.codigo}.pdf` },
      { where: { id: factura.id } }
    );
    
    return filePath;
  } catch (error) {
    console.error('Error generando PDF:', error);
    return null;
  }
};

// ==================== INTEGRACIÓN DIAN ====================
/*
exports.prepareDIANPayload = (factura, detalles, cliente, vendedor) => {
  return {
    encabezado: {
      tipoDocumento: '01', // 01 = Factura electrónica de venta
      numero: factura.codigo,
      fechaEmision: new Date(factura.fecha).toISOString(),
      moneda: 'COP',
      tipoOperacion: '01' // 01 = Venta nacional
    },
    emisor: {
      nit: '123456789-0',
      razonSocial: 'SENA Facturación',
      direccion: 'Cra 10 #20-30, Ibagué',
      telefono: '1234567',
      correo: 'facturacion@sena.edu.co'
    },
    receptor: {
      identificacion: cliente.identificacion || '222222222',
      tipoIdentificacion: cliente.tipo_identificacion || '13', // 13 = Cédula
      razonSocial: `${cliente.nombre} ${cliente.apellido}`,
      direccion: cliente.direccion || 'No especificada',
      telefono: cliente.telefono || '',
      correo: cliente.email || ''
    },
    items: detalles.map(detalle => ({
      codigo: detalle.producto_id,
      descripcion: detalle.Producto.nombre,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precio_unitario,
      subtotal: detalle.subtotal,
      impuestos: [{
        tipo: '01', // 01 = IVA
        porcentaje: 19,
        valor: detalle.subtotal * 0.19
      }]
    })),
    totales: {
      subtotal: factura.subtotal,
      impuestos: factura.impuesto,
      total: factura.total,
      formaPago: '01' // 01 = Contado
    }
  };
};

exports.sendToDIAN = async (payload, transaction) => {
  if (!DIAN_CONFIG.apiKey) return;
  
  try {
    const response = await axios.post(`${DIAN_CONFIG.apiUrl}/documentos`, payload, {
      headers: {
        'Authorization': `Bearer ${DIAN_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Guardar respuesta de DIAN
    await Factura.update(
      { 
        dian_status: response.data.estado,
        dian_cufe: response.data.cufe,
        dian_response: JSON.stringify(response.data) 
      },
      { where: { id: payload.encabezado.numero }, transaction }
    );
    
    return response.data;
  } catch (error) {
    await Factura.update(
      { 
        dian_status: 'ERROR',
        dian_response: JSON.stringify(error.response?.data || error.message) 
      },
      { where: { id: payload.encabezado.numero }, transaction }
    );
    throw error;
  }
};

exports.notifyDIANCancellation = async (facturaCodigo, motivo) => {
  if (!DIAN_CONFIG.apiKey) return;
  
  try {
    const response = await axios.post(
      `${DIAN_CONFIG.apiUrl}/documentos/${facturaCodigo}/anular`,
      { motivo },
      {
        headers: {
          'Authorization': `Bearer ${DIAN_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    await Factura.update(
      { 
        dian_status: 'ANULADA',
        dian_response: JSON.stringify(response.data) 
      },
      { where: { codigo: facturaCodigo } }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error notificando anulación a DIAN:', error);
    throw error;
  }
};

// ==================== INTEGRACIÓN IA ====================
exports.analyzeWithAI = async (factura, detalles) => {
  try {
    // Ejemplo de integración con servicio de IA para análisis predictivo
    if (process.env.AI_API_KEY) {
      const itemsAnalysis = detalles.map(d => ({
        product_id: d.producto_id,
        quantity: d.cantidad,
        price: d.precio_unitario
      }));
      
      const payload = {
        invoice_id: factura.codigo,
        client_id: factura.cliente_id,
        seller_id: factura.vendedor_id,
        total_amount: factura.total,
        items: itemsAnalysis,
        timestamp: new Date(factura.fecha).toISOString()
      };
      
      // Esto sería una llamada a un servicio externo de IA
      const response = await axios.post('https://api.ia-service.com/invoice-analysis', payload, {
        headers: {
          'Authorization': `Bearer ${process.env.AI_API_KEY}`
        }
      });
      
      // Guardar insights de IA
      await Factura.update(
        { ai_insights: JSON.stringify(response.data) },
        { where: { id: factura.id } }
      );
      
      return response.data;
    }
  } catch (error) {
    console.error('Error en análisis con IA:', error);
    return null;
  }
}; */

exports.getFacturaPDF = async (req, res) => {
  try {
    const { codigo } = req.params;
    const factura = await Factura.findOne({ where: { codigo } });
    
    if (!factura || !factura.pdf_path) {
      return res.status(404).json({ error: 'PDF no generado' });
    }
    
    const filePath = path.join(__dirname, '..', factura.pdf_path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Archivo PDF no encontrado' });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${codigo}.pdf`);
    
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFacturaByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    
    const facturas = await Factura.findAll({
      where: { cliente_id: clienteId },
      include: [
        { model: DetalleFactura, include: [Producto] },
        { model: Vendedor }
      ],
      order: [['fecha', 'DESC']]
    });
    
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFacturaByVendedor = async (req, res) => {
  try {
    const { vendedorId } = req.params;
    
    const facturas = await Factura.findAll({
      where: { vendedor_id: vendedorId },
      include: [
        { model: DetalleFactura, include: [Producto] },
        { model: Cliente }
      ],
      order: [['fecha', 'DESC']]
    });
    
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};