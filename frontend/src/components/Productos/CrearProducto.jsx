import React, { useState } from "react";

const CrearProducto = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Producto creado:", { nombre, precio });
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Crear Producto</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre del Producto
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="precio" className="form-label">
              Precio
            </label>
            <input
              type="number"
              className="form-control"
              id="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearProducto;