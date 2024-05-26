-- Insert seed data into the department table
INSERT INTO department (name) VALUES
('Engineering'),
('Human Resources'),
('Marketing');

-- Insert seed data into the roles table
INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 75000, 1),
('HR Specialist', 60000, 2),
('Marketing Coordinator', 50000, 3);

-- Insert seed data into the managers table
INSERT INTO managers (manager_name) VALUES
('John Doe'),
('Jane Smith');

-- Insert seed data into the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Johnson', 1, 1),
('Bob', 'Williams', 2, 2),
('Charlie', 'Brown', 3, NULL);