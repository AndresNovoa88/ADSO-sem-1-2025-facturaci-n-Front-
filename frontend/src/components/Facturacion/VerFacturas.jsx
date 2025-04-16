import React from "react";

const VerFacturas = () => {
  const facturas = [
    { id: 1, cliente: "Cliente 1", vendedor: "Vendedor 1", producto: "Producto 1", cantidad: 2 },
    { id: 2, cliente: "Cliente 2", vendedor: "Vendedor 2", producto: "Producto 2", cantidad: 3 },
  ];

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Lista de Facturas</h5>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id}>
                <td>{factura.id}</td>
                <td>{factura.cliente}</td>
                <td>{factura.vendedor}</td>
                <td>{factura.producto}</td>
                <td>{factura.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerFacturas;