const { pool } = require('../db');
const inquirer = require('inquirer');

const deleteDepartment = async (mainMenu) => {
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

const deleteRole = async (mainMenu) => {
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

const deleteEmployee = async (mainMenu) => {
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

module.exports = { deleteDepartment, deleteRole, deleteEmployee };
