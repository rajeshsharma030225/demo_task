const { Router } = require("express");
const upload = require("../middleware/upload");
const {
  getReportsEmployeeController,
  getSalaryGrowthOfEmployeeController,
  getAverageSalaryOfDepartmentController,
  getHistoricalEmployeeDataController,
} = require("../controllers/reports.controller");
const {
  rejectUnknownQueryParams,
  validateExportQuery,
} = require("../middleware/validation");
const { importCsvController } = require("../controllers/csvImport.controller");

const router = Router();

router.get(
  "/employees",
  rejectUnknownQueryParams, // Block unknown keys in query params
  validateExportQuery, // Validate query params value
  getReportsEmployeeController,
);

router.get(
  "/employees/:empNo/salary-growth",
  getSalaryGrowthOfEmployeeController,
);

router.get(
  "/departments/salary-average",
  getAverageSalaryOfDepartmentController,
);

router.get(
  "/employees/:empNo/history-comaprison",
  getHistoricalEmployeeDataController,
);

router.post("/employees/importCsv", upload.single("file"), importCsvController);

module.exports = router;
