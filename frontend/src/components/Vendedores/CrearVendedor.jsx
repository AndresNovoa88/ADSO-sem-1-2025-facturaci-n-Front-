import React, { useState } from "react";

const CrearVendedor = () => {
  const [nombre, setNombre] = useState("");
  const [comision, setComision] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vendedor creado:", { nombre, comision });
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Crear Vendedor</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre del Vendedor
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
            <label htmlFor="comision" className="form-label">
              Comisión (%)
            </label>
            <input
              type="number"
              className="form-control"
              id="comision"
              value={comision}
              onChange={(e) => setComision(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Crear Vendedor
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearVendedor;