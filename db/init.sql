CREATE DATABASE IF NOT EXISTS fastfood;

USE fastfood;

CREATE TABLE notificacion (
    id INT AUTO_INCREMENT,
    idTarea INT,
    trabajadorAsignado varchar(20),
    estado varchar(20),
    fechaHora timestamp DEFAULT CURRENT_TIMESTAMP,
    primary key(id)
);

CREATE TABLE orden (
    id INT AUTO_INCREMENT,
    nombreCliente varchar(10),
    usuarioCliente varchar(10),
    estado varchar(20),
    totalcuenta float,
    fechahora timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    primary key(id)
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT,
    nombre varchar(20),
    precio float,
    cantidad float,
    primary key(id)
);

CREATE TABLE tareas (
    id INT AUTO_INCREMENT,
    descripcion varchar(50),
    usuarioAsignado varchar(10),
    estado ENUM('creada', 'en proceso', 'terminada') DEFAULT 'creada',
    prioridad INT,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS  usuarios (
    nombre VARCHAR(10) PRIMARY KEY,
    usuario VARCHAR(10),
    password VARCHAR(10),
    rol ENUM('gerente', 'trabajador', 'cliente') NOT NULL DEFAULT 'gerente'
);

INSERT INTO usuarios
  (nombre,usuario,password,rol)
VALUES
  ('luis', 'luis_gar','123456789','gerente');
