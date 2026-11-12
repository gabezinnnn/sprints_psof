drop database if exists sharktank;

create database sharktank;

use sharktank;

create table usuario(
    id_usuario int primary key not null AUTO_INCREMENT,
    nome varchar(100) not null,
    email varchar(50) unique not null,
    senha varchar(500) unique not null,
    nutricionista boolean default(0)
);

create table insumo(
    id_insumo int primary key not null AUTO_INCREMENT,
<<<<<<< HEAD
=======
    unidade_medida varchar(20) not null,
>>>>>>> 204bc267db615618e7bd7a597ac8563aa1b21879
    nome_insumo varchar(100) not null unique
);

create table setor(
    id_setor int primary key not null AUTO_INCREMENT,
    nome_setor varchar(100) not null
);

create table registro(
    id_registro int primary key not null AUTO_INCREMENT,
    id_usuario int not null,
    id_insumo int not null,
    id_setor int not null,
    quantidade decimal(4, 2) not null,
<<<<<<< HEAD
    unidade_medida varchar(20) not null,
=======
>>>>>>> 204bc267db615618e7bd7a597ac8563aa1b21879
    data datetime not null default(now())
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
    ), (
        'Pedro de Alcântara',
        'pedro.alcantara@email.com',
        password('senha456'),
        0
    ), (
        'Henrique Tudor',
        'henrique.tudor@email.com',
        password('senha789'),
        0
    );

insert into
    insumo (nome_insumo)
values
    ('Banana'),
    ('Pão'),
    ('Leite');

insert into
    setor (nome_setor)
values
    ('Hortifruti'),
    ('Lanche'),
    ('Suco');

insert into
<<<<<<< HEAD
    registro(id_usuario, id_insumo, id_setor, quantidade, unidade_medida)
values
    (1, 2, 2, 30, 'kg'),
    (2, 3, 3, 20, 'u'),
    (3, 1, 1, 10, 'L');
=======
    registro(id_usuario, id_insumo, id_setor, quantidade)
values
    (1, 2, 2, 30),
    (2, 3, 3, 20),
    (3, 1, 1, 10);
>>>>>>> 204bc267db615618e7bd7a597ac8563aa1b21879
