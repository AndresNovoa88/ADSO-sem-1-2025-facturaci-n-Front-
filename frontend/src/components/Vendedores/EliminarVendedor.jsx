import React, { useState } from "react";

const EliminarVendedor = () => {
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Vendedor eliminado:", id);
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Eliminar Vendedor</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID del Vendedor
            </label>
            <input
              type="text"
              className="form-control"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-danger">
            Eliminar Vendedor
          </button>
        </form>
      </div>
    </div>
  );
};

export default EliminarVendedor;