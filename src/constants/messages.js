const ERROR_MESSAGES = {
  DATA_NOT_FOUND: "No Data Found",
  NO_DATA_AVAILABLE_TO_EXPORT: "No data available to export",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  CSV_FILE_IS_REQUIRED: "Csv file is required",
  CSV_VALIDATION_FAILED: "CSV validation failed",
  INVALID_CSV_FILE: "Invalid Csv File",
  INVALID_SORTBY_FIELD: "Invalid sort field",
  EXPORTIN_MUST_BE_CSV_OR_EXCEL: "exportIn must be either csv or excel",
  SEARCH_CANNOT_BE_EMPTY: "search cannot be empty",
  DEPARTMENT_CANNOT_BE_EMPTY: "department cannot be empty",
  JOBTITLE_CANNOT_BE_EMPTY: "jobTitle cannot be empty",
  MINSALARY_MUST_BE_POSITIVE_NUMBER: "minSalary must be a positive number",
  MAXSALARY_MUST_BE_POSITIVE_NUMBER: "maxSalary must be a positive number",
  MINSALARY_CANNOT_BE_GREATER_THAN_MAXSALARY:
    "minSalary cannot be greater than maxSalary",
  GENDER_MUST_BE_M_OR_F: "gender must be either M or F",
  HIRE_START_DATE_INVALID: "hireStartDate must be a valid date (YYYY-MM-DD)",
  HIRE_END_DATE_INVALID: "hireEndDate must be a valid date (YYYY-MM-DD)",
  HIRE_START_DATE_CANNOT_BE_LATER_THAN_END_DATE:
    "hireStartDate cannot be later than hireEndDate",
  INVALID_QUERY_PARAMETERS: "Invalid query parameters",
};

const SUCCESS_MESSAGES = {
  REPORTS_FOUND_SUCCESSFULLY: "Report found successfully",
  CSV_EXPORTED_SUCCESSFULLY: "CSV Exported successfully",
  EXCEL_EXPORTED_SUCCESSFULLY: "Excel Exported successfully",
  DATA_FOUND_SUCCESSFULLY: "Data Found Successfully",
  CSV_IMPORTED_SUCCESSFULLY: "Csv Imported Successfully",
};

module.exports = { ERROR_MESSAGES, SUCCESS_MESSAGES };
