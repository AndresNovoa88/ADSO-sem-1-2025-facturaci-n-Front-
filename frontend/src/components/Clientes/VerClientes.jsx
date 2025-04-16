import React from "react";

const VerClientes = () => {
  const clientes = [
    { id: 1, nombre: "Cliente 1", email: "cliente1@example.com" },
    { id: 2, nombre: "Cliente 2", email: "cliente2@example.com" },
  ];

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Lista de Clientes</h5>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerClientes;