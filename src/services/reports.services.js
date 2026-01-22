const { StatusCodes } = require("http-status-codes");
const EmployeeRepository = require("../repositories/report.repository");
const { ErrorResponse } = require("../common/response");
const { ERROR_MESSAGES } = require("../constants/messages");
const { SORT_FIELDS } = require("../constants/values");

async function getEmployeeReportService(
  page,
  limit,
  department,
  jobTitle,
  minSalary,
  maxSalary,
  hireStartDate,
  hireEndDate,
  gender,
  search,
  sortBy,
  sortOrder,
) {
  let orderByClause;

  // If sortBy with department, then applied order to department and employee number
  if (sortBy === "department") {
    orderByClause = `
    ORDER BY dpt.dept_name ${sortOrder}, emp.emp_no ${sortOrder}
  `;
  } else {
    const sortColumn = SORT_FIELDS[sortBy] || SORT_FIELDS.empNo;
    orderByClause = `ORDER BY ${sortColumn} ${sortOrder}`;
  }

  // Default WHERE condition (only active employees)
  const conditions = ["emp.is_active = true"];

  // Query replacements for safe parameter binding
  const replacements = {};

  // Individual filter handlers
  const employeeFilterHandlers = {
    // Filter by department
    department: (value) => ({
      condition: "dpt.dept_name = :department",
      replacement: { department: value },
    }),

    // Filter by job title
    jobTitle: (value) => ({
      condition: "t.title = :jobTitle",
      replacement: { jobTitle: value },
    }),

    // Minimum salary filter
    minSalary: (value) => ({
      condition: "s.salary >= :minSalary",
      replacement: { minSalary: value },
    }),

    // Maximum salary filter
    maxSalary: (value) => ({
      condition: "s.salary <= :maxSalary",
      replacement: { maxSalary: value },
    }),

    // Hire date start filter
    hireStartDate: (value) => ({
      condition: "emp.hire_date >= :hireStartDate",
      replacement: { hireStartDate: value },
    }),

    // Hire date end filter
    hireEndDate: (value) => ({
      condition: "emp.hire_date <= :hireEndDate",
      replacement: { hireEndDate: value },
    }),

    // Filter by gender
    gender: (value) => ({
      condition: "emp.gender = :gender",
      replacement: { gender: value },
    }),

    // Search by employee name
    search: (value) => ({
      condition: `
      (
        emp.first_name LIKE :search
        OR emp.last_name LIKE :search
        OR CONCAT(emp.first_name, ' ', emp.last_name) LIKE :search
      )
    `,
      replacement: { search: `%${value}%` },
    }),
  };

  // Collect all possible filters
  const filters = {
    department,
    jobTitle,
    minSalary,
    maxSalary,
    hireStartDate,
    hireEndDate,
    gender,
    search,
  };

  const hasAnyFilter = Object.values(filters).some(
    (v) => v !== undefined && v !== null && v !== "",
  );

  if (!hasAnyFilter) {
    // If no filters provided, return active records only
    conditions.push("dptemp.to_date = '9999-01-01'");
    conditions.push("t.to_date = '9999-01-01'");
    conditions.push("s.to_date = '9999-01-01'");
  }

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    if (value && employeeFilterHandlers[key]) {
      const { condition, replacement } = employeeFilterHandlers[key](value);
      conditions.push(condition);
      Object.assign(replacements, replacement);
    }
  });

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  let totalRecords = null;
  let totalPages = null;
  let limitClause = ``;

  // Pagination (only if limit is provided)
  if (limit) {
    // Fetch total record count
    totalRecords = await EmployeeRepository.getEmployeeReportCount(
      whereClause,
      replacements,
    );

    // Calculate total pages
    totalPages = Math.ceil(totalRecords / limit);

    const offset = (page - 1) * limit;
    limitClause = `LIMIT :limit OFFSET :offset`;
    replacements.limit = limit;
    replacements.offset = offset || 0; // offset optional, default 0
  }

  // Fetch final report data
  const data = await EmployeeRepository.getEmployeeReportData(
    whereClause,
    orderByClause,
    limitClause,
    replacements,
  );

  return {
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
    },
    reportData: data,
  };
}

// Get salary growth of an employee
async function getSalaryGrowthOfEmployeeService(empNo) {
  const data = await EmployeeRepository.getEmployeeSalaryGrowth(Number(empNo));
  return data;
}

// Get average salary for all departments
async function getAverageSalaryOfDepartmentService() {
  const data = await EmployeeRepository.getAverageSalaryOfDepartment();
  return data;
}

// Get current and historical data of an employee
async function getHistoricalDataOfEmployeeService(empNo) {
  const currentData = await EmployeeRepository.getCurrentEmployee(empNo);
  const historicalData = await EmployeeRepository.getHistoryOfEmployee(empNo);

  return {
    current: currentData?.length ? currentData[0] : {},
    history: historicalData,
  };
}

module.exports = {
  getEmployeeReportService,
  getSalaryGrowthOfEmployeeService,
  getAverageSalaryOfDepartmentService,
  getHistoricalDataOfEmployeeService,
};
