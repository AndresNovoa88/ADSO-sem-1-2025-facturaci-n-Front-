import React, { useState } from "react";

const EliminarCliente = () => {
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cliente eliminado:", id);
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Eliminar Cliente</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID del Cliente
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
            Eliminar Cliente
          </button>
        </form>
      </div>
    </div>
  );
};

export default EliminarCliente;