const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Salary = sequelize.define(
  "Salary",
  {
    emp_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    from_date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  { tableName: "salaries" }
);

module.exports = Salary;
