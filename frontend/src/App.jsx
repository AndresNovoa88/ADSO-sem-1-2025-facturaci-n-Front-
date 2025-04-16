import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

// Importar componentes de Productos
import CrearProducto from "./components/Productos/CrearProducto";
import VerProductos from "./components/Productos/VerProductos";
import ModificarProducto from "./components/Productos/ModificarProducto";
import EliminarProducto from "./components/Productos/EliminarProducto";

// Importar componentes de Clientes
import CrearCliente from "./components/Clientes/CrearCliente";
import VerClientes from "./components/Clientes/VerClientes";
import ModificarCliente from "./components/Clientes/ModificarCliente";
import EliminarCliente from "./components/Clientes/EliminarCliente";

// Importar componentes de Vendedores
import CrearVendedor from "./components/Vendedores/CrearVendedor";
import VerVendedores from "./components/Vendedores/VerVendedores";
import ModificarVendedor from "./components/Vendedores/ModificarVendedor";
import EliminarVendedor from "./components/Vendedores/EliminarVendedor";

// Importar componentes de Facturación
import CrearFactura from "./components/Facturacion/CrearFactura";
import VerFacturas from "./components/Facturacion/VerFacturas";
import ModificarFactura from "./components/Facturacion/ModificarFactura";
import EliminarFactura from "./components/Facturacion/EliminarFactura";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Rutas para Productos */}
          <Route path="/productos/crear" element={<CrearProducto />} />
          <Route path="/productos/ver" element={<VerProductos />} />
          <Route path="/productos/modificar" element={<ModificarProducto />} />
          <Route path="/productos/eliminar" element={<EliminarProducto />} />

          {/* Rutas para Clientes */}
          <Route path="/clientes/crear" element={<CrearCliente />} />
          <Route path="/clientes/ver" element={<VerClientes />} />
          <Route path="/clientes/modificar" element={<ModificarCliente />} />
          <Route path="/clientes/eliminar" element={<EliminarCliente />} />

          {/* Rutas para Vendedores */}
          <Route path="/vendedores/crear" element={<CrearVendedor />} />
          <Route path="/vendedores/ver" element={<VerVendedores />} />
          <Route path="/vendedores/modificar" element={<ModificarVendedor />} />
          <Route path="/vendedores/eliminar" element={<EliminarVendedor />} />

          {/* Rutas para Facturación */}
          <Route path="/facturacion/crear" element={<CrearFactura />} />
          <Route path="/facturacion/ver" element={<VerFacturas />} />
          <Route path="/facturacion/modificar" element={<ModificarFactura />} />
          <Route path="/facturacion/eliminar" element={<EliminarFactura />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;