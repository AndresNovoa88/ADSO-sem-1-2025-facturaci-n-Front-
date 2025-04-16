import React, { useState } from "react";

const ModificarVendedor = () => {
  const [nombre, setNombre] = useState("");
  const [comision, setComision] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vendedor modificado:", { nombre, comision });
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Modificar Vendedor</h5>
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
            Modificar Vendedor
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModificarVendedor;