require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "demo_task",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "Root@1234",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: true, // set true to see SQL queries
    pool: {
      max: 10,
      min: 0,
      // acquire: 30000,
      // idle: 10000,
    },
    // define: {
    //   timestamps: false, // disable automatic createdAt/updatedAt
    // },
  }
);

module.exports = sequelize;
