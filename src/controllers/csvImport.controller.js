const csv = require("csv-parser");
const { StatusCodes } = require("http-status-codes");
const moment = require("moment");
const { Readable } = require("stream");
const { ErrorResponse, SuccessResponse } = require("../common/response");
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require("../constants/messages");
const { importCsvService } = require("../services/csvImport.services");
const { validateCsvRow } = require("../utils/csvValidator");
const { REQUIRED_HEADERS } = require("../constants/values");

async function importCsvController(req, res) {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          ErrorResponse(
            StatusCodes.BAD_REQUEST,
            ERROR_MESSAGES.CSV_FILE_IS_REQUIRED,
          ),
        );
    }

    // Flags and storage
    let headersValidated = false;
    let responseSent = false;
    let csvHeaders = [];
    const rows = [];
    const validationErrors = [];

    // Create a readable stream from the uploaded file buffer
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv()) // Pipe the stream to CSV parser
      .on("headers", (headers) => {
        if (responseSent) return;

        // Trim spaces from headers
        csvHeaders = headers.map((h) => h.trim());

        // Check for missing required headers
        const missingHeaders = REQUIRED_HEADERS.filter((h) => {
          return !csvHeaders.includes(h);
        });

        // Check for extra headers not allowed
        const extraHeaders = csvHeaders.filter(
          (h) => !REQUIRED_HEADERS.includes(h),
        );

        // Send error if headers are invalid
        if (missingHeaders.length || extraHeaders.length) {
          responseSent = true;
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
              ErrorResponse(
                StatusCodes.BAD_REQUEST,
                `Header validation failed. ${
                  missingHeaders.length
                    ? `Missing: ${missingHeaders.join(", ")}. `
                    : ""
                }${
                  extraHeaders.length
                    ? `Extra: ${extraHeaders.join(", ")}.`
                    : ""
                }`,
              ),
            );
        }

        headersValidated = true;
      })
      .on("data", (row) => {
        // Collect each row if no response sent yet
        if (!responseSent) {
          rows.push(row);
        }
      })
      .on("end", async () => {
        if (responseSent) return;

        // Check if headers were valid and rows exist
        if (!headersValidated || !rows.length) {
          responseSent = true;
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
              ErrorResponse(
                StatusCodes.BAD_REQUEST,
                ERROR_MESSAGES.INVALID_CSV_FILE,
              ),
            );
        }

        // Validate each row
        rows.forEach((row, index) => {
          const result = validateCsvRow(row, index);
          if (!result.isValid) validationErrors.push(result);
        });

        // Send validation errors if any
        if (validationErrors.length) {
          responseSent = true;
          return res.status(StatusCodes.BAD_REQUEST).json(
            ErrorResponse(
              StatusCodes.BAD_REQUEST,
              ERROR_MESSAGES.CSV_VALIDATION_FAILED,
              {
                totalErrors: validationErrors.length,
                errors: validationErrors,
              },
            ),
          );
        }
        try {
          // Import valid CSV rows into database
          await importCsvService(rows);

          responseSent = true;
          return res
            .status(StatusCodes.OK)
            .json(
              SuccessResponse(
                StatusCodes.OK,
                SUCCESS_MESSAGES.CSV_IMPORTED_SUCCESSFULLY,
              ),
            );
        } catch (error) {
          // Handle internal errors during import
          responseSent = true;
          console.error("Error at importCsvService :::", error);

          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(
              ErrorResponse(
                StatusCodes.INTERNAL_SERVER_ERROR,
                ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
              ),
            );
        }
      })
      .on("error", (error) => {
        // Handle errors during CSV parsing
        if (responseSent) return;

        responseSent = true;
        console.error("CSV parsing error :::", error);

        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            ErrorResponse(
              StatusCodes.BAD_REQUEST,
              ERROR_MESSAGES.INVALID_CSV_FILE,
            ),
          );
      });
  } catch (error) {
    // Handle unexpected errors in controller
    console.error("Error at importCsvController :::", error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        ),
      );
  }
}

module.exports = { importCsvController };
