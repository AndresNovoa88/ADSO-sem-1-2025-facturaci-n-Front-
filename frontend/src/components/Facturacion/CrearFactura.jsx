import React, { useState } from "react";

const CrearFactura = () => {
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Factura creada:", { cliente, vendedor, producto, cantidad });
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Crear Factura</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="cliente" className="form-label">
              Cliente
            </label>
            <input
              type="text"
              className="form-control"
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="vendedor" className="form-label">
              Vendedor
            </label>
            <input
              type="text"
              className="form-control"
              id="vendedor"
              value={vendedor}
              onChange={(e) => setVendedor(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="producto" className="form-label">
              Producto
            </label>
            <input
              type="text"
              className="form-control"
              id="producto"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="cantidad" className="form-label">
              Cantidad
            </label>
            <input
              type="number"
              className="form-control"
              id="cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Crear Factura
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearFactura;