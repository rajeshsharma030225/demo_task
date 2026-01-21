"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("dept_manager", {
      emp_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      dept_no: {
        type: Sequelize.CHAR(4),
        allowNull: false,
        primaryKey: true,
      },
      from_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      to_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("dept_manager", {
      fields: ["emp_no"],
      type: "foreign key",
      name: "fk_dept_manager_employee",
      references: { table: "employees", field: "emp_no" },
      onDelete: "CASCADE",
    });

    await queryInterface.addConstraint("dept_manager", {
      fields: ["dept_no"],
      type: "foreign key",
      name: "fk_dept_manager_department",
      references: { table: "departments", field: "dept_no" },
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("dept_manager");
  },
};
