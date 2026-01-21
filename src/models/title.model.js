const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Title = sequelize.define(
  "Title",
  {
    emp_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    from_date: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  { tableName: "titles" }
);

module.exports = Title;
