const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const { EMPLOYEE_EXPORT_HEADERS } = require("../constants/values");
const { SUCCESS_MESSAGES } = require("../constants/messages");

// Make sure the export folder exists
const EXPORT_FOLDER = path.join(__dirname, "../", "exports");
const CSV_FOLDER = path.join(EXPORT_FOLDER, "csv");
const EXCEL_FOLDER = path.join(EXPORT_FOLDER, "excel");

// Create exports folder
if (!fs.existsSync(EXPORT_FOLDER)) {
  fs.mkdirSync(EXPORT_FOLDER, { recursive: true });
}

// Create csv folder
if (!fs.existsSync(CSV_FOLDER)) {
  fs.mkdirSync(CSV_FOLDER, { recursive: true });
}

// Create excel folder
if (!fs.existsSync(EXCEL_FOLDER)) {
  fs.mkdirSync(EXCEL_FOLDER, { recursive: true });
}

function csvExport(data) {
  const parser = new Parser({
    fields: EMPLOYEE_EXPORT_HEADERS.map((h) => ({
      label: h.label,
      value: h.key,
    })),
  });

  const csv = parser.parse(data);

  // Generate unique file name with timestamp
  const fileName = `employee_report_${Date.now()}.csv`;
  const filePath = path.join(CSV_FOLDER, fileName);

  // Save CSV file
  fs.writeFileSync(filePath, csv);
  return { message: SUCCESS_MESSAGES.CSV_EXPORTED_SUCCESSFULLY };
}

async function excelExport(data, res) {
  // Generate a unique filename for the Excel file
  const fileName = `employee_report_${Date.now()}.xlsx`;

  // Full path where the Excel file will be saved
  const filePath = path.join(EXCEL_FOLDER, fileName);

  // Create a streaming Excel workbook
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    filename: filePath,
    useStyles: false,
    useSharedStrings: false,
  });

  // Add a worksheet named 'Employees'
  const worksheet = workbook.addWorksheet("Employees");

  // Set columns based on export headers
  worksheet.columns = EMPLOYEE_EXPORT_HEADERS.map((h) => ({
    header: h.label,
    key: h.key,
    width: 20,
  }));

  // Write each row to the worksheet
  for (const row of data) {
    worksheet.addRow(row).commit(); // commit each row immediately
  }

  // Commit the worksheet and workbook
  worksheet.commit();

  // finalize the Excel file
  await workbook.commit();

  return {
    message: SUCCESS_MESSAGES.EXCEL_EXPORTED_SUCCESSFULLY,
    fileName,
    filePath,
  };
}

module.exports = { csvExport, excelExport };
