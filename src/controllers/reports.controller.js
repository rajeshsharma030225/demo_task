const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../common/response");
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require("../constants/messages");
const {
  getEmployeeReportService,
  getSalaryGrowthOfEmployeeService,
  getAverageSalaryOfDepartmentService,
  getHistoricalDataOfEmployeeService,
} = require("../services/reports.services");
const { csvExport, excelExport } = require("../utils/helper");

async function getReportsEmployeeController(req, res) {
  try {
    // Parse pagination query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Destructure filter and export query params
    const {
      department,
      jobTitle,
      minSalary,
      maxSalary,
      hireStartDate,
      hireEndDate,
      gender,
      search,
      exportIn,
    } = req.query;

    // Check if this request is for export (CSV or Excel)
    const isExport = ["csv", "excel"].includes(exportIn?.toLowerCase());

    // Sorting parameters
    const sortBy = req.query.sortBy || "emp_no";
    const sortOrder = (req.query.sortOrder || "DESC").toUpperCase();

    // Fetch employee report data from service
    const data = await getEmployeeReportService(
      isExport ? 1 : Number(page), // Use page 1 for export
      isExport ? null : Number(limit), // No limit for export
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
    );

    // Handle CSV export
    if (exportIn?.toLowerCase() === "csv") {
      // Check if there is data to export
      if (!data?.reportData?.length) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            ErrorResponse(
              StatusCodes.NOT_FOUND,
              ERROR_MESSAGES.NO_DATA_AVAILABLE_TO_EXPORT,
            ),
          );
      }
      // Call CSV export utility
      const exportCsv = csvExport(data?.reportData || []);
      return res
        .status(StatusCodes.OK)
        .json(SuccessResponse(StatusCodes.OK, exportCsv?.message, []));
    }

    // Handle Excel export
    if (exportIn?.toLowerCase() === "excel") {
      // Check if there is data to export
      if (!data?.reportData?.length) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            ErrorResponse(
              StatusCodes.NOT_FOUND,
              ERROR_MESSAGES.NO_DATA_AVAILABLE_TO_EXPORT,
            ),
          );
      }
      // Call Excel export utility
      const exportExcel = await excelExport(data?.reportData || [], res);
      return res
        .status(StatusCodes.OK)
        .json(SuccessResponse(StatusCodes.OK, exportExcel?.message, []));
    }

    return res
      .status(StatusCodes.OK)
      .json(
        SuccessResponse(
          StatusCodes.OK,
          SUCCESS_MESSAGES.REPORTS_FOUND_SUCCESSFULLY,
          data,
        ),
      );
  } catch (error) {
    // Handle unexpected errors
    console.error("Error at getReportsEmployeeController ---", error);
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

async function getSalaryGrowthOfEmployeeController(req, res) {
  try {
    // Extract employee number from route parameters
    const { empNo } = req.params;

    // Get data of employee salary growth data for the given employee
    const data = await getSalaryGrowthOfEmployeeService(empNo);

    // Determine response message based on data
    const responseMessages = Object.keys(data).length
      ? SUCCESS_MESSAGES.DATA_FOUND_SUCCESSFULLY
      : ERROR_MESSAGES.DATA_NOT_FOUND;

    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse(StatusCodes.OK, responseMessages, data));
  } catch (error) {
    // Handle unexpected errors
    console.error("Error at getSalaryGrowthOfEmployeeController ==", error);
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

async function getAverageSalaryOfDepartmentController(req, res) {
  try {
    // Fetch average salary data for all departments
    const data = await getAverageSalaryOfDepartmentService();

    return res
      .status(StatusCodes.OK)
      .json(
        SuccessResponse(
          StatusCodes.OK,
          SUCCESS_MESSAGES.DATA_FOUND_SUCCESSFULLY,
          data,
        ),
      );
  } catch (error) {
    // Handle unexpected errors
    console.error("Error at getAverageSalaryOfDepartmentController :::", error);
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

async function getHistoricalEmployeeDataController(req, res) {
  try {
    // Extract employee number from route parameters
    const { empNo } = req.params;

    // Get current and historical data for the given employee
    const data = await getHistoricalDataOfEmployeeService(Number(empNo));

    // Send response message based on data
    const responseMessages =
      !Object.keys(data?.current)?.length && !data?.history?.length
        ? ERROR_MESSAGES.DATA_NOT_FOUND
        : SUCCESS_MESSAGES.DATA_FOUND_SUCCESSFULLY;
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse(StatusCodes.OK, responseMessages, data));
  } catch (error) {
    // Handle unexpected errors
    console.error("Error at getHistoricalEmployeeDataController:::", error);
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

module.exports = {
  getReportsEmployeeController,
  getSalaryGrowthOfEmployeeController,
  getAverageSalaryOfDepartmentController,
  getHistoricalEmployeeDataController,
};
