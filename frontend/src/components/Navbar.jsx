import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Sistema de Facturación XYZ
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            {/* Menú desplegable para Productos */}
            <li className="nav-item dropdown">
  <Link
    className="nav-link dropdown-toggle"
    to="#"
    id="navbarDropdownMenuLinkProductos"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Productos
  </Link>
  <ul
    className="dropdown-menu"
    aria-labelledby="navbarDropdownMenuLinkProductos"
  >
    <li>
      <Link className="dropdown-item" to="/productos/crear">
        Crear Producto
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/productos/ver">
        Ver Productos
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/productos/modificar">
        Modificar Producto
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/productos/eliminar">
        Eliminar Producto
      </Link>
    </li>
  </ul>
</li>

            {/* Menú desplegable para Clientes */}
            <li className="nav-item dropdown">
  <Link
    className="nav-link dropdown-toggle"
    to="#"
    id="navbarDropdownMenuLinkClientes"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Clientes
  </Link>
  <ul
    className="dropdown-menu"
    aria-labelledby="navbarDropdownMenuLinkClientes"
  >
    <li>
      <Link className="dropdown-item" to="/clientes/crear">
        Crear Cliente
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/clientes/ver">
        Ver Clientes
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/clientes/modificar">
        Modificar Cliente
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/clientes/eliminar">
        Eliminar Cliente
      </Link>
    </li>
  </ul>
</li>

            {/* Menú desplegable para Vendedores */}
            <li className="nav-item dropdown">
  <Link
    className="nav-link dropdown-toggle"
    to="#"
    id="navbarDropdownMenuLinkVendedores"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Vendedores
  </Link>
  <ul
    className="dropdown-menu"
    aria-labelledby="navbarDropdownMenuLinkVendedores"
  >
    <li>
      <Link className="dropdown-item" to="/vendedores/crear">
        Crear Vendedor
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/vendedores/ver">
        Ver Vendedores
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/vendedores/modificar">
        Modificar Vendedor
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/vendedores/eliminar">
        Eliminar Vendedor
      </Link>
    </li>
  </ul>
</li>

            {/* Menú desplegable para Facturación */}
            <li className="nav-item dropdown">
  <Link
    className="nav-link dropdown-toggle"
    to="#"
    id="navbarDropdownMenuLinkFacturacion"
    role="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    Facturación
  </Link>
  <ul
    className="dropdown-menu"
    aria-labelledby="navbarDropdownMenuLinkFacturacion"
  >
    <li>
      <Link className="dropdown-item" to="/facturacion/crear">
        Crear Factura
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/facturacion/ver">
        Ver Facturas
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/facturacion/modificar">
        Modificar Factura
      </Link>
    </li>
    <li>
      <Link className="dropdown-item" to="/facturacion/eliminar">
        Eliminar Factura
      </Link>
    </li>
  </ul>
</li>
                  
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;