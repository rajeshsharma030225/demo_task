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
    await queryInterface.createTable("titles", {
      emp_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      from_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        primaryKey: true,
      },
      to_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint("titles", {
      fields: ["emp_no"],
      type: "foreign key",
      name: "fk_titles_employee",
      references: { table: "employees", field: "emp_no" },
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
    await queryInterface.dropTable("titles");
  },
};
