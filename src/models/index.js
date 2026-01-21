const Department = require("./department.model");
const DeptEmployee = require("./department_employee.model");
const DeptManager = require("./department_manager.model");
const Employee = require("./employee.model");
const Salary = require("./salary.model");
const Title = require("./title.model");

// Employee relations
Employee.hasMany(DeptEmployee, { foreignKey: "emp_no" });
Employee.hasMany(DeptManager, { foreignKey: "emp_no" });
Employee.hasMany(Title, { foreignKey: "emp_no" });
Employee.hasMany(Salary, { foreignKey: "emp_no" });

// Department relations
Department.hasMany(DeptEmployee, { foreignKey: "dept_no" });
Department.hasMany(DeptManager, { foreignKey: "dept_no" });

// Export models
module.exports = {
  Employee,
  Department,
  DeptEmployee,
  DeptManager,
  Title,
  Salary,
};
