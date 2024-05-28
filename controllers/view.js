const { pool } = require('../db');
const inquirer = require('inquirer');

const viewAllDepartments = async (mainMenu) => {
    const result = await pool.query('SELECT * FROM department');
    console.table(result.rows);
    mainMenu();
};

const viewAllRoles = async (mainMenu) => {
    const result = await pool.query(`
        SELECT r.id, r.title, r.salary, d.name AS department
        FROM roles r
        INNER JOIN department d ON r.department_id = d.id
    `);
    console.table(result.rows);
    mainMenu();
};

const viewAllEmployees = async (mainMenu) => {
    const result = await pool.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
               CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        LEFT JOIN roles r ON e.roles_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table(result.rows);
    mainMenu();
};

const viewEmployeesByManager = async (mainMenu) => {
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
        JOIN roles r ON e.roles_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE e.manager_id = $1
    `, [answer.managerId]);

    console.table(result.rows);
    mainMenu();
};

const viewEmployeesByDepartment = async (mainMenu) => {
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
        SELECT e.id, e.first_name, e.last_name, r.title
        FROM employee e
        JOIN roles r ON e.roles_id = r.id
        WHERE r.department_id = $1
    `, [answer.departmentId]);

    console.table(result.rows);
    mainMenu();
};

const viewTotalUtilizedBudget = async (mainMenu) => {
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
        SELECT d.name, SUM(r.salary) AS total_budget
        FROM employee e
        JOIN roles r ON e.roles_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE d.id = $1
        GROUP BY d.name
    `, [answer.departmentId]);

    console.table(result.rows);
    mainMenu();
};

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    viewTotalUtilizedBudget
};
