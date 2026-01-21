const { QueryTypes } = require("sequelize");
const sequelize = require("../config/db");

class EmployeeRepository {
  // Fetch employee report data
  static async getEmployeeReportData(
    whereClause,
    orderByClause,
    limitClause,
    replacements,
  ) {
    const sql = `
    SELECT 
      emp.emp_no AS "Employee number",
      CONCAT(emp.first_name, ' ', emp.last_name) AS "Full name",
      emp.gender AS "Gender",
      emp.hire_date AS "Hire date",
      dpt.dept_name AS "Department name",
      t.title AS "Job title",
      s.salary AS "Salary",
      s.from_date AS "From date",
      s.to_date AS "To date"
    FROM employees emp
    INNER JOIN dept_emp dptemp ON dptemp.emp_no = emp.emp_no 
    AND dptemp.to_date = '9999-01-01'
    INNER JOIN departments dpt ON dpt.dept_no = dptemp.dept_no
    INNER JOIN titles t ON t.emp_no = emp.emp_no
    AND t.to_date = '9999-01-01'
    INNER JOIN salaries s ON s.emp_no = emp.emp_no
    AND s.to_date = '9999-01-01'
    ${whereClause}
    ${orderByClause}
    ${limitClause}
  `;

    // Execute the query with replacements
    return sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
    });
  }

  // Count total employees matching a where clause
  static async getEmployeeReportCount(whereClause, replacements) {
    const sql = `
    SELECT COUNT(*) AS total
    FROM employees emp
    INNER JOIN dept_emp dptemp ON dptemp.emp_no = emp.emp_no 
    AND dptemp.to_date = '9999-01-01'
    INNER JOIN departments dpt ON dpt.dept_no = dptemp.dept_no
    INNER JOIN titles t ON t.emp_no = emp.emp_no
    AND t.to_date = '9999-01-01'
    INNER JOIN salaries s ON s.emp_no = emp.emp_no
    AND s.to_date = '9999-01-01'
    ${whereClause}
  `;

    // Execute the query with replacements
    const result = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
    });

    // Return the count
    return result[0].total;
  }

  // Fetch salary growth for a specific employee (yearly)
  static async getEmployeeSalaryGrowth(empNo) {
    const sql = `
    SELECT YEAR(s.from_date) as year, s.salary from employees emp
    INNER JOIN salaries s ON emp.emp_no = s.emp_no
    WHERE emp.emp_no = :empNo
    ORDER BY s.from_date ASC
  `;

    // Execute the query with replacements
    const result = await sequelize.query(sql, {
      replacements: {
        empNo,
      },
      type: QueryTypes.SELECT,
    });

    return result;
  }

  // Fetch average salary of each department (current salaries only)
  static async getAverageSalaryOfDepartment() {
    // Average Salary based on current salary
    const sql = `
    SELECT d.dept_name, AVG(s.salary) as avgSalary
    FROM departments d
    JOIN dept_emp de ON d.dept_no = de.dept_no AND de.to_date = '9999-01-01'
    JOIN salaries s ON s.emp_no = de.emp_no AND s.to_date = '9999-01-01'
    GROUP BY d.dept_name;
  `;

    // Execute the query with replacements
    const result = await sequelize.query(sql, {
      // replacements,
      type: QueryTypes.SELECT,
    });

    return result;
  }

  // Fetch current employee data (latest department, title, salary)
  static async getCurrentEmployee(empNo) {
    const sql = `
    SELECT 
      emp.emp_no as 'Employee Number',
      CONCAT(emp.first_name, ' ', emp.last_name) AS 'Full Name',
      dept.dept_name as 'Department Name', 
      t.title as 'Job Title',
      s.salary as 'Salary'
    FROM employees emp
    JOIN dept_emp de ON emp.emp_no = de.emp_no
    AND de.to_date = '9999-01-01'
    JOIN departments dept ON dept.dept_no = de.dept_no
    JOIN titles t ON emp.emp_no = t.emp_no
    AND t.to_date = '9999-01-01'
    JOIN salaries s ON emp.emp_no = s.emp_no
    AND s.to_date = '9999-01-01'
    WHERE emp.emp_no = :empNo;
  `;

    // Execute the query with replacements
    const result = await sequelize.query(sql, {
      replacements: {
        empNo,
      },
      type: QueryTypes.SELECT,
    });

    return result;
  }

  // Fetch historical department, title, and salary data for an employee
  static async getHistoryOfEmployee(empNo) {
    const sql = `
    SELECT
      de.from_date as 'From Date',
      de.to_date as 'To Date',
      dept.dept_name as 'Department Name',
      t.title as 'Job Title',
      s.salary as 'Salary'
    FROM dept_emp de
    INNER JOIN departments dept ON dept.dept_no = de.dept_no
    INNER JOIN titles t ON t.emp_no = de.emp_no
    AND t.from_date <= de.to_date
    AND t.to_date >= de.from_date
    INNER JOIN salaries s ON s.emp_no = de.emp_no
    AND s.from_date <= de.to_date
    AND s.to_date >= de.from_date
    WHERE de.emp_no = :empNo
    ORDER BY de.from_date;
  `;

    // Execute the query with replacements
    const result = await sequelize.query(sql, {
      replacements: {
        empNo,
      },
      type: QueryTypes.SELECT,
    });

    return result;
  }
}

module.exports = EmployeeRepository;
