const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

const inquirer = require('inquirer')

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
    {
        // PostgreSQL username
        user: 'postgres',
        // Enter PostgreSQL password
        password: '1234567890',
        host: 'localhost',
        database: 'company_db'
    },
    console.log('Connected to the company_db database!')
)

pool.connect();

// Main menu prompt
const mainMenu = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
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
            client.end();
            console.log('Goodbye!');
            process.exit();
    }
};

const updateEmployeeManager = async () => {
    const employees = await client.query('SELECT id, first_name, last_name FROM employee');
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

    await client.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [answers.managerId, answers.employeeId]);
    console.log('Employee manager updated successfully.');
    mainMenu();
};

const viewEmployeesByManager = async () => {
    const managers = await client.query('SELECT id, first_name, last_name FROM employee WHERE id IN (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL)');
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

    const result = await client.query(`
      SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      WHERE e.manager_id = $1
    `, [answer.managerId]);

    console.table(result.rows);
    mainMenu();
};

const viewEmployeesByDepartment = async () => {
    const departments = await client.query('SELECT id, name FROM department');
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

    const result = await client.query(`
      SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      WHERE d.id = $1
    `, [answer.departmentId]);

    console.table(result.rows);
    mainMenu();
};

const deleteDepartment = async () => {
    const departments = await client.query('SELECT id, name FROM department');
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

    await client.query('DELETE FROM department WHERE id = $1', [answer.departmentId]);
    console.log('Department deleted successfully.');
    mainMenu();
};

const deleteRole = async () => {
    const roles = await client.query('SELECT id, title FROM role');
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

    await client.query('DELETE FROM role WHERE id = $1', [answer.roleId]);
    console.log('Role deleted successfully.');
    mainMenu();
};

const deleteEmployee = async () => {
    const employees = await client.query('SELECT id, first_name, last_name FROM employee');
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

    await client.query('DELETE FROM employee WHERE id = $1', [answer.employeeId]);
    console.log('Employee deleted successfully.');
    mainMenu();
};

const viewTotalUtilizedBudget = async () => {
    const departments = await client.query('SELECT id, name FROM department');
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

    const result = await client.query(`
      SELECT d.name AS department_name, SUM(r.salary) AS total_utilized_budget
      FROM employee e
      JOIN role r ON e.role_id = r.id
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

