drop database if exists sharktank;

create database sharktank;

use sharktank;

create table usuario(
    id_usuario int primary key not null,
    nome varchar(100) not null,
    email varchar(50) unique not null,
    senha varchar(16) unique not null,
    nutricionista boolean default(0)
);

create table insumo(
    id_insumo int primary key not null,
    unidade_medida varchar(20) not null,
    nome_insumo varchar(100) not null unique
);

create table setor(
    id_setor int primary key not null,
    nome_setor int primary key not null
);

create table registro(
    id_registro int primary key not null,
    id_usuario int not null,
    id_insumo int not null,
    id_setor int not null,
    quantidade decimal(4, 2) not null,
    data date not null default(curdate()),
    hora time not null default(curtime())
);

alter table
    registro
add
    constraint anota foreign key (id_usuario) references usuario(id_usuario);

alter table
    registro
add
    constraint nomeado foreign key (id_insumo) references insumo(id_insumo);

alter table
    registro
add
    constraint contido foreign key (id_setor) references setor(id_setor);

insert into
    usuario (nome, email, senha, nutricionista)
values
    (
        'Maria Oliveira',
        'maria.oliveira@email.com',
        password('senha123'),
        1
    ) (
        'Pedro de Alcântara',
        'pedro.alcantara@email.com',
        password('senha456'),
        0
    ) (
        'Henrique Tudor',
        'henrique.tudor@email.com',
        password('senha789'),
        0
    );

insert into
    insumo (unidade_medida, nome_insumo)
values
    ('kg', 'Banana'),
    ('u', 'Pão'),
    ('L', 'Leite');

insert into setor (nome_setor) values 
('Hortifruti'),
('Lanche'),
('Suco');

insert into registro
