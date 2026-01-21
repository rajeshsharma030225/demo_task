const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Employee = sequelize.define(
  "Employee",
  {
    emp_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("M", "F"),
      allowNull: false,
    },
    hire_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "employees",
    timestamps: true,
  }
);

// // Employee relations
// Employee.hasMany(DeptEmployee, { foreignKey: "emp_no" });
// Employee.hasMany(DeptManager, { foreignKey: "emp_no" });
// Employee.hasMany(Title, { foreignKey: "emp_no" });
// Employee.hasMany(Salary, { foreignKey: "emp_no" });

module.exports = Employee;
