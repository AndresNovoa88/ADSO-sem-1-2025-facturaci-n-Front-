import React from "react";

const VerProductos = () => {
  // Aquí puedes obtener la lista de productos desde un estado o una API
  const productos = [
    { id: 1, nombre: "Producto 1", precio: 100 },
    { id: 2, nombre: "Producto 2", precio: 200 },
  ];

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Lista de Productos</h5>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerProductos;