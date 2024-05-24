-- Drop the database if it exists
DROP DATABASE IF EXISTS employeetrack_db;

-- Create the database
CREATE DATABASE employeetrack_db;

-- Connect to the newly created database
\c employeetrack_db

-- Create the department table
CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

-- Create the role table
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER,
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE SET NULL
);

-- Create the employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE SET NULL
);
