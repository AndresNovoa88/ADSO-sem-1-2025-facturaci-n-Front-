-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS facturasena;
USE facturasena;

-- Tabla de Roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  rol_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Tabla de Clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(100),
  estado BOOLEAN DEFAULT TRUE,
  creado_por INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);

-- Tabla de Vendedores
CREATE TABLE vendedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(100),
  cuota_ventas DECIMAL(10,2) DEFAULT 0,
  estado BOOLEAN DEFAULT TRUE,
  creado_por INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);

-- Tabla de Productos
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categoria VARCHAR(50),
  estado BOOLEAN DEFAULT TRUE,
  creado_por INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);

-- Tabla de Facturas
CREATE TABLE facturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  cliente_id INT NOT NULL,
  vendedor_id INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subtotal DECIMAL(10,2) NOT NULL,
  impuesto DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'PENDIENTE',
  creado_por INT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (vendedor_id) REFERENCES vendedores(id),
  FOREIGN KEY (creado_por) REFERENCES usuarios(id)
);

-- Tabla de Detalles de Factura
CREATE TABLE detalle_factura (
  id INT AUTO_INCREMENT PRIMARY KEY,
  factura_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (factura_id) REFERENCES facturas(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar roles básicos
INSERT INTO roles (nombre) VALUES 
('Administrador'),
('Gerente'),
('Vendedor');

-- Insertar usuario admin inicial (password: admin123)
INSERT INTO usuarios (username, password, email, rol_id) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq4H1zL3AI6ZR2SAqGBd5n6Jx7UyKS', 'admin@facturasena.com', 1);