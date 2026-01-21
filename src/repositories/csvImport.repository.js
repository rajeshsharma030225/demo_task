const sequelize = require("../config/db");

class CsvImportRepository {
  // Get the next available employee number
  static async getNextEmpNo(transaction) {
    const [[row]] = await sequelize.query(
      `SELECT IFNULL(MAX(emp_no),0) + 1 AS startEmpNo FROM employees`,
      { transaction },
    );
    return row.startEmpNo;
  }

  // Fetch all departments from the database
  static async getAllDepartments(transaction) {
    const [rows] = await sequelize.query(
      `SELECT dept_no, dept_name FROM departments`,
      { transaction },
    );
    return rows;
  }

  // Get the next available department number (formatted as 'd001', 'd002', etc.)
  static async getNextDeptNo(transaction) {
    const [[row]] = await sequelize.query(
      `
      SELECT CONCAT(
        'd',
        LPAD(IFNULL(MAX(SUBSTRING(dept_no,2)),0)+1,3,'0')
      ) AS nextDeptNo FROM departments
      `,
      { transaction },
    );
    return row.nextDeptNo;
  }

  // Bulk insert multiple employees
  static async bulkInsertEmployees(data, transaction) {
    await sequelize.query(
      `
      INSERT INTO employees
      (emp_no, first_name, last_name, birth_date, gender, hire_date)
      VALUES ${data.map(() => "(?,?,?,?,?,?)").join(",")}
      `,
      {
        // Flatten the data array for replacements
        replacements: data.flatMap((d) => [
          d.empNo,
          d.firstName,
          d.lastName,
          d.birthDate,
          d.gender,
          d.hireDate,
        ]),
        transaction,
      },
    );
  }

  // Bulk insert multiple departments
  static async bulkInsertDepartments(data, transaction) {
    await sequelize.query(
      `
      INSERT INTO departments (dept_no, dept_name)
      VALUES ${data.map(() => "(?,?)").join(",")}
      `,
      {
        replacements: data.flatMap((d) => [d.deptNo, d.deptName]),
        transaction,
      },
    );
  }

  // Bulk insert employee-department assignments
  static async bulkInsertDeptEmp(data, transaction) {
    await sequelize.query(
      `
      INSERT INTO dept_emp (emp_no, dept_no, from_date, to_date)
      VALUES ${data.map(() => "(?,?,?,?)").join(",")}
      `,
      {
        replacements: data.flatMap((d) => [
          d.empNo,
          d.deptNo,
          d.fromDate,
          d.toDate,
        ]),
        transaction,
      },
    );
  }

  // Bulk insert job titles for employees
  static async bulkInsertTitles(data, transaction) {
    await sequelize.query(
      `
      INSERT INTO titles (emp_no, title, from_date, to_date)
      VALUES ${data.map(() => "(?,?,?,?)").join(",")}
      `,
      {
        replacements: data.flatMap((d) => [
          d.empNo,
          d.title,
          d.fromDate,
          d.toDate,
        ]),
        transaction,
      },
    );
  }

  // Bulk insert salaries for employees
  static async bulkInsertSalaries(data, transaction) {
    await sequelize.query(
      `
      INSERT INTO salaries (emp_no, salary, from_date, to_date)
      VALUES ${data.map(() => "(?,?,?,?)").join(",")}
      `,
      {
        replacements: data.flatMap((d) => [
          d.empNo,
          d.salary,
          d.fromDate,
          d.toDate,
        ]),
        transaction,
      },
    );
  }
}

module.exports = CsvImportRepository;
