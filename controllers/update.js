const { pool } = require('../db');
const inquirer = require('inquirer');

const updateEmployeeRole = async (mainMenu) => {
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
            message: 'Select the employee to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
        },
    ]);

    await pool.query('UPDATE employee SET roles_id = $1 WHERE id = $2', [answers.roleId, answers.employeeId]);
    console.log('Employee role updated successfully.');
    mainMenu();
};

const updateEmployeeManager = async (mainMenu) => {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the new manager for the employee:',
            choices: employeeChoices,
        },
    ]);

    await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [answers.managerId, answers.employeeId]);
    console.log('Employee manager updated successfully.');
    mainMenu();
};

module.exports = { updateEmployeeRole, updateEmployeeManager };