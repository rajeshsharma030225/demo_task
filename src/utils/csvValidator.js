// Check if a string is a valid date in YYYY-MM-DD format
function isValidDate(value) {
  if (!value) return false;

  // Check the date format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) return false;

  const date = new Date(value);
  // Check date is valid or not
  return !isNaN(date.getTime());
}

// Calculate full years between two dates
function yearsBetween(start, end) {
  let years = end.getFullYear() - start.getFullYear();
  const m = end.getMonth() - start.getMonth();

  if (m < 0 || (m === 0 && end.getDate() < start.getDate())) {
    years--;
  }
  return years;
}

// If 'To date' is blank or undefined then store "9999-01-01" as default 'To date'
function normalizeToDate(toDate) {
  return !toDate || toDate === "-" ? "9999-01-01" : toDate;
}

// Validate a single CSV row
function validateCsvRow(row, index) {
  const errors = [];
  const rowNumber = index + 2; // +2 because header is row 1

  const requiredFields = [
    "First name",
    "Last name",
    "Birth date",
    "Gender",
    "Hire date",
    "Department name",
    "Job title",
    "Salary",
    "From date",
  ];

  // Check for empty required fields
  for (const field of requiredFields) {
    if (!row[field] || String(row[field]).trim() === "") {
      errors.push(`${field} is required`);
    }
  }

  // Validate gender
  if (row["Gender"] && !["M", "F"].includes(row["Gender"])) {
    errors.push("Gender must be M or F");
  }

  // Validate salary
  if (row["Salary"] && isNaN(Number(row["Salary"]))) {
    errors.push("Salary must be a number");
  }
  // Date format validation
  const dateFields = ["Birth date", "Hire date", "From date", "To date"];
  for (const field of dateFields) {
    if (row[field] && !isValidDate(row[field])) {
      errors.push(`${field} must be in YYYY-MM-DD format (row ${rowNumber})`);
    }
  }

  // Check hire date at least 18 years after birth date
  if (isValidDate(row["Birth date"]) && isValidDate(row["Hire date"])) {
    const birthDate = new Date(row["Birth date"]);
    const hireDate = new Date(row["Hire date"]);

    // 18 years gap check
    if (yearsBetween(birthDate, hireDate) < 18) {
      errors.push(
        `Hire date must be at least 18 years after Birth date (row ${rowNumber})`,
      );
    }
  }

  // From date and To date cannot be before Hire date
  if (isValidDate(row["Hire date"])) {
    const hireDate = new Date(row["Hire date"]);

    if (isValidDate(row["From date"])) {
      const fromDate = new Date(row["From date"]);
      if (fromDate < hireDate) {
        errors.push(
          `From date cannot be earlier than Hire date (row ${rowNumber})`,
        );
      }
    }

    if (isValidDate(row["To date"])) {
      const toDate = new Date(row["To date"]);
      if (toDate < hireDate) {
        errors.push(
          `To date cannot be earlier than Hire date (row ${rowNumber})`,
        );
      }
    }
  }

  // 'To date' can not be before than 'From date'
  if (isValidDate(row["From date"]) && isValidDate(row["To date"])) {
    const fromDate = new Date(row["From date"]);
    const toDate = new Date(row["To date"]);

    if (fromDate > toDate) {
      errors.push(
        `To date can not be earlier than From date (row ${rowNumber})`,
      );
    }
  }

  // Return validation result
  if (errors.length) {
    return {
      isValid: false,
      rowNumber,
      errors,
    };
  }

  return { isValid: true };
}

module.exports = { validateCsvRow };
