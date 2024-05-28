const inquirer = require('inquirer');
const {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    deleteDepartment,
    deleteRole,
    deleteEmployee,
    viewTotalUtilizedBudget
} = require('./controllers');

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
            return viewAllDepartments(mainMenu);
        case 'View all roles':
            return viewAllRoles(mainMenu);
        case 'View all employees':
            return viewAllEmployees(mainMenu);
        case 'Add a department':
            return addDepartment(mainMenu);
        case 'Add a role':
            return addRole(mainMenu);
        case 'Add an employee':
            return addEmployee(mainMenu);
        case 'Update an employee role':
            return updateEmployeeRole(mainMenu);
        case 'Update employee manager':
            return updateEmployeeManager(mainMenu);
        case 'View employees by manager':
            return viewEmployeesByManager(mainMenu);
        case 'View employees by department':
            return viewEmployeesByDepartment(mainMenu);
        case 'Delete department':
            return deleteDepartment(mainMenu);
        case 'Delete role':
            return deleteRole(mainMenu);
        case 'Delete employee':
            return deleteEmployee(mainMenu);
        case 'View total utilized budget of a department':
            return viewTotalUtilizedBudget(mainMenu);
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }
};

module.exports = { mainMenu };
