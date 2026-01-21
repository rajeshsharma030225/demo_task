const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const sequelize = require("./src/config/db");
const ReportRoutes = require("./src/routes/reports.routes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000", // frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(helmet());

app.use("/api/reports", ReportRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log("MySQL connected via Sequelize");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MySQL:", error);
    process.exit(1);
  }
}

startServer();
