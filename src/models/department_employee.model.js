const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DeptEmployee = sequelize.define(
  "DeptEmployee",
  {
    emp_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    dept_no: {
      type: DataTypes.CHAR(4),
      primaryKey: true,
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  { tableName: "dept_emp" }
);

module.exports = DeptEmployee;
