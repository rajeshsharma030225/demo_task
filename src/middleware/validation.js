const { query, validationResult } = require("express-validator");
const { ALLOWED_KEYS } = require("../constants/values");
const { ERROR_MESSAGES } = require("../constants/messages");

// Middleware to reject any unknown query params
function rejectUnknownQueryParams(req, res, next) {
  // Find query keys that are not allowed
  const unknownKeys = Object.keys(req.query).filter(
    (key) => !ALLOWED_KEYS.includes(key),
  );

  // If any extra keys are found, return an error response
  if (unknownKeys.length) {
    return res.status(400).json({
      message: "Invalid query parameters",
      invalidKeys: unknownKeys,
    });
  }

  // Continue to next middleware or controller
  next();
}

// Middleware to validate allowed query params values
const validateExportQuery = [
  // Validate export format (optional, must be 'csv' or 'excel')
  query("exportIn")
    .optional()
    .isIn(["csv", "excel"])
    .withMessage(ERROR_MESSAGES.EXPORTIN_MUST_BE_CSV_OR_EXCEL),

  // Validate search text (optional, cannot be empty if provided)
  query("search")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.SEARCH_CANNOT_BE_EMPTY),

  // Validate department filter (optional, cannot be empty if provided)
  query("department")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.DEPARTMENT_CANNOT_BE_EMPTY),

  // Validate job title filter (optional, cannot be empty if provided)
  query("jobTitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(ERROR_MESSAGES.JOBTITLE_CANNOT_BE_EMPTY),

  // Validate minimum salary (optional, must be positive integer)
  query("minSalary")
    .optional()
    .isInt({ min: 0 })
    .withMessage(ERROR_MESSAGES.MINSALARY_MUST_BE_POSITIVE_NUMBER)
    .toInt(),

  // Validate maximum salary (optional, must be positive integer)
  query("maxSalary")
    .optional()
    .isInt({ min: 0 })
    .withMessage(ERROR_MESSAGES.MAXSALARY_MUST_BE_POSITIVE_NUMBER)
    .toInt(),

  // Validate gender filter (optional, must be 'M' or 'F')
  query("gender")
    .optional()
    .isIn(["M", "F"])
    .withMessage(ERROR_MESSAGES.GENDER_MUST_BE_M_OR_F),

  // Validate hire start date (optional, must be valid ISO date YYYY-MM-DD)
  query("hireStartDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage(ERROR_MESSAGES.HIRE_START_DATE_INVALID),

  // Validate hire end date (optional, must be valid ISO date YYYY-MM-DD)
  query("hireEndDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage(ERROR_MESSAGES.HIRE_END_DATE_INVALID),

  // Final middleware to handle validation result
  (req, res, next) => {
    // Collect all validation errors
    const errors = validationResult(req);

    // If any validation error exists, return simple message
    if (!errors.isEmpty()) {
      // Extract only readable messages
      const messages = errors.array().map((e) => e.msg);

      return res.status(400).json({
        // If only one error, show that directly
        message:
          messages.length === 1
            ? messages[0]
            : ERROR_MESSAGES.INVALID_QUERY_PARAMETERS,

        // If multiple errors, include the full list
        ...(messages.length > 1 && { details: messages }),
      });
    }

    // Cross-field validation for salary range
    const minSalary = Number(req.query.minSalary);
    const maxSalary = Number(req.query.maxSalary);
    const { hireStartDate, hireEndDate } = req.query;

    // Ensure minSalary is not greater than maxSalary
    if (
      !Number.isNaN(minSalary) &&
      !Number.isNaN(maxSalary) &&
      minSalary > maxSalary
    ) {
      return res.status(400).json({
        message: ERROR_MESSAGES.MINSALARY_CANNOT_BE_GREATER_THAN_MAXSALARY,
      });
    }

    // Ensure hireStartDate is not later than hireEndDate
    if (
      hireStartDate &&
      hireEndDate &&
      new Date(hireStartDate) > new Date(hireEndDate)
    ) {
      return res.status(400).json({
        message: ERROR_MESSAGES.HIRE_START_DATE_CANNOT_BE_LATER_THAN_END_DATE,
      });
    }

    // All validations passed, continue to controller
    next();
  },
];

module.exports = { rejectUnknownQueryParams, validateExportQuery };
