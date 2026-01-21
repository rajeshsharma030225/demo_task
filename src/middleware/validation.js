const { query, validationResult } = require("express-validator");
const { ALLOWED_KEYS } = require("../constants/values");

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
    .withMessage("exportIn must be either csv or excel"),

  // Validate search text (optional, cannot be empty if provided)
  query("search")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("search cannot be empty"),

  // Validate department filter (optional, cannot be empty if provided)
  query("department")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("department cannot be empty"),

  // Validate job title filter (optional, cannot be empty if provided)
  query("jobTitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("jobTitle cannot be empty"),

  // Validate minimum salary (optional, must be positive integer)
  query("minSalary")
    .optional()
    .isInt({ min: 0 })
    .withMessage("minSalary must be a positive number")
    .toInt(),

  // Validate maximum salary (optional, must be positive integer)
  query("maxSalary")
    .optional()
    .isInt({ min: 0 })
    .withMessage("maxSalary must be a positive number")
    .toInt(),

  // Validate gender filter (optional, must be 'M' or 'F')
  query("gender")
    .optional()
    .isIn(["M", "F"])
    .withMessage("gender must be either M or F"),

  // Validate hire start date (optional, must be valid ISO date YYYY-MM-DD)
  query("hireStartDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("hireStartDate must be a valid date (YYYY-MM-DD)"),

  // Validate hire end date (optional, must be valid ISO date YYYY-MM-DD)
  query("hireEndDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("hireEndDate must be a valid date (YYYY-MM-DD)"),

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
          messages.length === 1 ? messages[0] : "Invalid query parameters",

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
        message: "minSalary cannot be greater than maxSalary",
      });
    }

    // Ensure hireStartDate is not later than hireEndDate
    if (
      hireStartDate &&
      hireEndDate &&
      new Date(hireStartDate) > new Date(hireEndDate)
    ) {
      return res.status(400).json({
        message: "hireStartDate cannot be later than hireEndDate",
      });
    }

    // All validations passed, continue to controller
    next();
  },
];

module.exports = { rejectUnknownQueryParams, validateExportQuery };
