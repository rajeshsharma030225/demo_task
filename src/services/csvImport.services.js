const sequelize = require("../config/db");
const CsvImportRepository = require("../repositories/csvImport.repository");
const { normalizeToDate } = require("../utils/helper");

async function importCsvService(rows) {
  // Start a new database transaction
  const transaction = await sequelize.transaction();
  try {
    // Get the next available employee number
    let empNo = await CsvImportRepository.getNextEmpNo(transaction);

    // Fetch existing departments from DB
    const existingDepts =
      await CsvImportRepository.getAllDepartments(transaction);
    // Create a map of department name and number
    const deptMap = new Map(existingDepts.map((d) => [d.dept_name, d.dept_no]));
    // Get the next department number for new departments
    let nextDeptNo = await CsvImportRepository.getNextDeptNo(transaction);

    const employees = [];
    const departments = [];
    const deptEmp = [];
    const titles = [];
    const salaries = [];

    // Process each CSV row
    for (const row of rows) {
      // Assign current employee number and increment for next row
      let currentEmpNo = empNo++;

      employees.push({
        empNo: currentEmpNo,
        firstName: row["First name"],
        lastName: row["Last name"],
        birthDate: row["Birth date"],
        gender: row["Gender"],
        hireDate: row["Hire date"],
      });

      // Generate new dept number if department is new
      let deptNo = deptMap.get(row["Department name"]);
      if (!deptNo) {
        deptNo = nextDeptNo;
        deptMap.set(row["Department name"], deptNo);
        // Add new department to insert list
        departments.push({
          deptNo,
          deptName: row["Department name"],
        });

        // Generate next department number (e.g., d001, d002)
        const num = parseInt(nextDeptNo.substring(1)) + 1;
        nextDeptNo = `d${String(num).padStart(3, "0")}`;
      }

      deptEmp.push({
        empNo: currentEmpNo,
        deptNo,
        fromDate: row["From date"],
        toDate: normalizeToDate(row["To date"]),
      });

      titles.push({
        empNo: currentEmpNo,
        title: row["Job title"],
        fromDate: row["From date"],
        toDate: normalizeToDate(row["To date"]),
      });

      salaries.push({
        empNo: currentEmpNo,
        salary: row["Salary"],
        fromDate: row["From date"],
        toDate: normalizeToDate(row["To date"]),
      });
    }

    // Insert the department if not exists in database
    if (departments.length) {
      await CsvImportRepository.bulkInsertDepartments(departments, transaction);
    }
    // Bulk insert employees, dept assignments, titles, and salaries
    await CsvImportRepository.bulkInsertEmployees(employees, transaction);
    await CsvImportRepository.bulkInsertDeptEmp(deptEmp, transaction);
    await CsvImportRepository.bulkInsertTitles(titles, transaction);
    await CsvImportRepository.bulkInsertSalaries(salaries, transaction);

    // Commit transaction after all inserts succeed
    await transaction.commit();
    return employees.length;
  } catch (error) {
    // Rollback transaction in case of any error
    await transaction.rollback();
    throw error;
  }
}

module.exports = { importCsvService };
