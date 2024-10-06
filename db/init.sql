CREATE DATABASE IF NOT EXISTS fastfood;

USE fastfood;

CREATE TABLE notificacion (
    id INT AUTO_INCREMENT,
    idTarea INT,
    trabajadorAsignado varchar(20),
    estado varchar(20),
    fechaHora timestamp DEFAULT CURRENT_TIMESTAMP
    primary key(id)
);

CREATE TABLE orden (
    id INT AUTO_INCREMENT,
    nombreCliente varchar(10),
    usuarioCliente varchar(10),
    estado varchar(10),
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
    prioridad INT
    primary key(id)
);

CREATE TABLE usuarios (
    nombre varchar(10),
    usuario varchar(10),
    password varchar(10),
    rol ENUM('gerente', 'trabajador', 'cliente') NOT NULL DEFAULT 'gerente',
    primary key(usuario)
);