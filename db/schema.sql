-- @block
-- Drop the database if it exists
DROP DATABASE IF EXISTS company_db;
-- Create the database
CREATE DATABASE company_db;
-- Connect to the newly created database
\c company_db


-- @block
-- Create the department table
CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

-- Create the role table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- Create the managers table
CREATE TABLE IF NOT EXISTS managers (
    manager_name VARCHAR(55),
    manager_id SERIAL PRIMARY KEY
);

-- Create the employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES managers(manager_id) ON DELETE SET NULL
);