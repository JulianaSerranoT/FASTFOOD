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