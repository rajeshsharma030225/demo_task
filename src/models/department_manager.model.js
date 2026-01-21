const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DeptManager = sequelize.define(
  "DeptManager",
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
  { tableName: "dept_manager" }
);

module.exports = DeptManager;
