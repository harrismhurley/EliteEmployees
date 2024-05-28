const { pool } = require('../db');
const inquirer = require('inquirer');

const addDepartment = async (mainMenu) => {
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

const addRole = async (mainMenu) => {
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

const addEmployee = async (mainMenu) => {
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

    await pool.query('INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.firstName, answers.lastName, answers.roleId, answers.managerId]);
    console.log('Employee added successfully.');
    mainMenu();
};

module.exports = { addDepartment, addRole, addEmployee };
