import React from "react";

const VerVendedores = () => {
  const vendedores = [
    { id: 1, nombre: "Vendedor 1", comision: 10 },
    { id: 2, nombre: "Vendedor 2", comision: 15 },
  ];

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Lista de Vendedores</h5>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Comisión (%)</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((vendedor) => (
              <tr key={vendedor.id}>
                <td>{vendedor.id}</td>
                <td>{vendedor.nombre}</td>
                <td>{vendedor.comision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerVendedores;