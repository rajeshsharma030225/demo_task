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
    // dept_emp indexes
    await queryInterface.addIndex("dept_emp", ["emp_no"], {
      name: "idx_dept_emp_emp_no",
    });

    await queryInterface.addIndex("dept_emp", ["dept_no"], {
      name: "idx_dept_emp_dept_no",
    });

    // titles index
    await queryInterface.addIndex("titles", ["emp_no"], {
      name: "idx_titles_emp_no",
    });

    // salaries covering index
    await queryInterface.addIndex(
      "salaries",
      ["to_date", "emp_no", "salary", "from_date"],
      {
        name: "idx_salaries_covering",
      },
    );

    await queryInterface.addIndex(
      "dept_emp",
      ["to_date", "dept_no", "emp_no"],
      {
        name: "idx_dept_emp_active",
      },
    );

    await queryInterface.addIndex(
      "dept_emp",
      ["emp_no", "to_date", "dept_no"],
      {
        name: "idx_dept_emp_emp_to_dept",
      },
    );

    // departments lookup
    await queryInterface.addIndex("departments", ["dept_no", "dept_name"], {
      name: "idx_departments_deptno_name",
    });

    // employees active + sorting
    await queryInterface.addIndex("employees", ["is_active", "emp_no"], {
      name: "idx_emp_active_empno_desc",
      order: ["ASC", "DESC"], // MySQL 8+ / PostgreSQL
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex("dept_emp", "idx_dept_emp_emp_no");
    await queryInterface.removeIndex("dept_emp", "idx_dept_emp_dept_no");
    await queryInterface.removeIndex("titles", "idx_titles_emp_no");
    await queryInterface.removeIndex("salaries", "idx_salaries_covering");
    await queryInterface.removeIndex("dept_emp", "idx_dept_emp_active");
    await queryInterface.removeIndex("dept_emp", "idx_dept_emp_emp_to_dept");
    await queryInterface.removeIndex(
      "departments",
      "idx_departments_deptno_name",
    );
    await queryInterface.removeIndex("employees", "idx_emp_active_empno_desc");
  },
};
