const { viewAllDepartments, viewAllRoles, viewAllEmployees, viewEmployeesByManager, viewEmployeesByDepartment, viewTotalUtilizedBudget } = require('./view');
const { addDepartment, addRole, addEmployee } = require('./add');
const { updateEmployeeRole, updateEmployeeManager } = require('./update');
const { deleteDepartment, deleteRole, deleteEmployee } = require('./delete');

module.exports = {
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    viewEmployeesByManager,
    viewEmployeesByDepartment,
    viewTotalUtilizedBudget,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    deleteDepartment,
    deleteRole,
    deleteEmployee
};
