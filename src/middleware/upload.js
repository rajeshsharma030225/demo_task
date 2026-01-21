const multer = require("multer");

// Configure Multer for file uploads
const upload = multer({
  // Store uploaded files in memory (not on disk)
  storage: multer.memoryStorage(),

  // Filter files by type
  fileFilter: (req, file, cb) => {
    // Only allow files with .csv extension
    if (!file.originalname.endsWith(".csv")) {
      return cb(new Error("Only CSV files are allowed"));
    }
    // Accept the file
    cb(null, true);
  },
});

module.exports = upload;
