// Headers used when exporting employee data (e.g., to CSV)
const EMPLOYEE_EXPORT_HEADERS = [
  { label: "Employee number", key: "Employee number" },
  { label: "Full name", key: "Full name" },
  { label: "Gender", key: "Gender" },
  { label: "Hire date", key: "Hire date" },
  { label: "Department name", key: "Department name" },
  { label: "Job title", key: "Job title" },
  { label: "Salary", key: "Salary" },
  { label: "From date", key: "From date" },
  { label: "To date", key: "To date" },
];

// List of allowed query parameters for filtering or pagination
const ALLOWED_KEYS = [
  "page",
  "limit",
  "exportIn",
  "search",
  "department",
  "jobTitle",
  "minSalary",
  "maxSalary",
  "gender",
  "hireStartDate",
  "hireEndDate",
  "sortBy",
  "sortOrder",
];

// Required headers when importing employee data (e.g., from CSV)
const REQUIRED_HEADERS = [
  "First name",
  "Last name",
  "Birth date",
  "Gender",
  "Hire date",
  "Department name",
  "Job title",
  "Salary",
  "From date",
  "To date",
];

const SORT_FIELDS = {
  empNo: "emp.emp_no",
  hireDate: "emp.hire_date",
  salary: "s.salary",
  department: "dpt.dept_name",
};

module.exports = {
  EMPLOYEE_EXPORT_HEADERS,
  ALLOWED_KEYS,
  REQUIRED_HEADERS,
  SORT_FIELDS,
};
