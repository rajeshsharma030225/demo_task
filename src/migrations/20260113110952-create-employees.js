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
    await queryInterface.createTable("employees", {
      emp_no: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(14),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(16),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM("M", "F"),
        allowNull: false,
      },
      hire_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("employees");
  },
};
