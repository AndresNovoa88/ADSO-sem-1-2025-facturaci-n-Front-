import React, { useState } from "react";

const ModificarCliente = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cliente modificado:", { nombre, email });
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Modificar Cliente</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre del Cliente
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
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Modificar Cliente
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModificarCliente;