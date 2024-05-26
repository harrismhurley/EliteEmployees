-- @block
SELECT 
    e.id AS employee_id,
    e.first_name,
    e.last_name,
    r.title AS role_title,
    r.salary,
    d.name AS department_name,
    m.first_name AS manager_first_name,
    m.last_name AS manager_last_name
FROM 
    employee e
JOIN 
    roles r ON e.roles_id = r.id
JOIN 
    department d ON r.department_id = d.id
LEFT JOIN 
    employee m ON e.manager_id = m.id;
    