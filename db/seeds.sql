-- @block
-- Insert seed data into the department table
INSERT INTO department (name) VALUES
('Engineering'),
('Human Resources'),
('Marketing');

-- @block
-- Insert seed data into the role table
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 75000, 1),
('HR Specialist', 60000, 2),
('Marketing Coordinator', 50000, 3);

-- @block
-- Insert seed data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Johnson', 1, NULL),
('Bob', 'Williams', 2, NULL),
('Charlie', 'Brown', 3, NULL),
('David', 'Smith', 1, 1),
('Eve', 'Davis', 2, 2),
('Frank', 'Miller', 3, 3);