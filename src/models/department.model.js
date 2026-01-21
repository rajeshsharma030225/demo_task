const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Department = sequelize.define(
  "Department",
  {
    dept_no: {
      type: DataTypes.CHAR(4),
      primaryKey: true,
      allowNull: false,
    },
    dept_name: {
      type: DataTypes.STRING(40),
      unique: true,
      allowNull: false,
    },
  },
  { tableName: "departments" }
);

module.exports = Department;
