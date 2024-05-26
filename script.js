const express = require('express');
const { Pool } = require('pg');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool({
    user: 'postgres', // PostgreSQL username
    password: '1234567890', // Enter PostgreSQL password
    host: 'localhost',
    database: 'company_db',
});

pool.connect()
    .then(() => console.log('Connected to the company_db database!'))
    .catch(err => console.error('Connection error', err.stack));

// Main menu prompt
const mainMenu = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update employee manager',
                'View employees by manager',
                'View employees by department',
                'Delete department',
                'Delete role',
                'Delete employee',
                'View total utilized budget of a department',
                'Exit',
            ],
        },
    ]);

    switch (answers.action) {
        case 'View all departments':
            return viewAllDepartments();
        case 'View all roles':
            return viewAllRoles();
        case 'View all employees':
            return viewAllEmployees();
        case 'Add a department':
            return addDepartment();
        case 'Add a role':
            return addRole();
        case 'Add an employee':
            return addEmployee();
        case 'Update an employee role':
            return updateEmployeeRole();
        case 'Update employee manager':
            return updateEmployeeManager();
        case 'View employees by manager':
            return viewEmployeesByManager();
        case 'View employees by department':
            return viewEmployeesByDepartment();
        case 'Delete department':
            return deleteDepartment();
        case 'Delete role':
            return deleteRole();
        case 'Delete employee':
            return deleteEmployee();
        case 'View total utilized budget of a department':
            return viewTotalUtilizedBudget();
        case 'Exit':
            pool.end();
            console.log('Goodbye!');
            process.exit();
    }
};

// Function to view all departments
const viewAllDepartments = async () => {
    const result = await pool.query('SELECT * FROM department');
    console.table(result.rows);
    mainMenu();
};

// Function to view all roles
const viewAllRoles = async () => {
    const result = await pool.query('SELECT * FROM roles');
    console.table(result.rows);
    mainMenu();
};

// Function to view all employees
const viewAllEmployees = async () => {
    const result = await pool.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
               CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN roles r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table(result.rows);
    mainMenu();
};

// Function to add a department
const addDepartment = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:',
        },
    ]);

    await pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name]);
    console.log('Department added successfully.');
    mainMenu();
};

// Function to add a role
const addRole = async () => {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dep => ({
        name: dep.name,
        value: dep.id,
    }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:',
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for the role:',
            choices: departmentChoices,
        },
    ]);

    await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.departmentId]);
    console.log('Role added successfully.');
    mainMenu();
};

// Function to add an employee
const addEmployee = async () => {
    const roles = await pool.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id,
    }));

    const managers = await pool.query('SELECT id, first_name, last_name FROM employee');
    const managerChoices = managers.rows.map(manager => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id,
    }));
    managerChoices.push({ name: 'None', value: null });

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:',
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role for the employee:',
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the manager for the employee:',
            choices: managerChoices,
        },
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.firstName, answers.lastName, answers.roleId, answers.managerId]);
    console.log('Employee added successfully.');
    mainMenu();
};

// Function to update an employee role
const updateEmployeeRole = async () => {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
    }));

    const roles = await pool.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id,
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee whose role you want to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role:',
            choices: roleChoices,
        },
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.roleId, answers.employeeId]);
    console.log('Employee role updated successfully.');
    mainMenu();
};

// Function to update employee manager
const updateEmployeeManager = async () => {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee whose manager you want to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the new manager:',
            choices: employeeChoices.concat([{ name: 'None', value: null }]),
        },
    ]);

    await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [answers.managerId, answers.employeeId]);
    console.log('Employee manager updated successfully.');
    mainMenu();
};

// Function to view employees by manager
const viewEmployeesByManager = async () => {
    const managers = await pool.query('SELECT id, first_name, last_name FROM employee WHERE id IN (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL)');
    const managerChoices = managers.rows.map(mgr => ({
        name: `${mgr.first_name} ${mgr.last_name}`,
        value: mgr.id,
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'managerId',
        message: 'Select the manager to view their employees:',
        choices: managerChoices,
    });

    const result = await pool.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
        FROM employee e
        JOIN roles r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE e.manager_id = $1
    `, [answer.managerId]);

    console.table(result.rows);
    mainMenu();
};

// Function to view employees by department
const viewEmployeesByDepartment = async () => {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dep => ({
        name: dep.name,
        value: dep.id,
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select the department to view its employees:',
        choices: departmentChoices,
    });

    const result = await pool.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
        FROM employee e
        JOIN roles r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE d.id = $1
    `, [answer.departmentId]);

    console.table(result.rows);
    mainMenu();
};

// Function to delete a department
const deleteDepartment = async () => {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dep => ({
        name: dep.name,
        value: dep.id,
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select the department to delete:',
        choices: departmentChoices,
    });

    await pool.query('DELETE FROM department WHERE id = $1', [answer.departmentId]);
    console.log('Department deleted successfully.');
    mainMenu();
};

// Function to delete a role
const deleteRole = async () => {
    const roles = await pool.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id,
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select the role to delete:',
        choices: roleChoices,
    });

    await pool.query('DELETE FROM roles WHERE id = $1', [answer.roleId]);
    console.log('Role deleted successfully.');
    mainMenu();
};

// Function to delete an employee
const deleteEmployee = async () => {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to delete:',
        choices: employeeChoices,
    });

    await pool.query('DELETE FROM employee WHERE id = $1', [answer.employeeId]);
    console.log('Employee deleted successfully.');
    mainMenu();
};

// Function to view total utilized budget of a department
const viewTotalUtilizedBudget = async () => {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(dep => ({
        name: dep.name,
        value: dep.id,
    }));

    const answer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select the department to view its total utilized budget:',
        choices: departmentChoices,
    });

    const result = await pool.query(`
        SELECT d.name AS department, SUM(r.salary) AS utilized_budget
        FROM employee e
        JOIN roles r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE d.id = $1
        GROUP BY d.name
    `, [answer.departmentId]);

    console.table(result.rows);
    mainMenu();
};

// Start the main menu
mainMenu();

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
