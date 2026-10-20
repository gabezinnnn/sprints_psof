drop database if exists sharktank;

create database sharktank;

use sharktank;

create table usuario(
    id int primary key not null,
    nome varchar(100) not null,
    email varchar(50) unique not null,
    senha varchar(16) unique not null,
    admin boolean default(0)
);

insert into
    usuario (nome, email, senha, admin)
values
    (
        'Maria Oliveira',
        'maria.oliveira@email.com',
        SHA2('senha123', 256),
        1
    )