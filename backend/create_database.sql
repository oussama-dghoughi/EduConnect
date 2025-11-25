-- Script de création de la base de données EduConnect
-- Exécutez ce script avec : mysql -u root -p < create_database.sql

CREATE DATABASE IF NOT EXISTS educonnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE educonnect;

-- La base est créée, les tables seront créées automatiquement par Doctrine Migrations

