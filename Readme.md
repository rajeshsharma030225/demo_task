<!-- Index created -->
<!-- CREATE INDEX idx_dept_emp_emp_no ON dept_emp(emp_no);
CREATE INDEX idx_dept_emp_dept_no ON dept_emp(dept_no);
CREATE INDEX idx_titles_emp_no ON titles(emp_no);
CREATE INDEX idx_salaries_covering ON salaries(to_date, emp_no, salary, from_date); -->

# 1. Install Packages
npm i

# 2. Initialize the migration folder or create manually migrations folder
npx sequelize-cli init

# 3. Generate the migration file
<!-- npx sequelize-cli migration:generate --name create-employees -->
npx sequelize-cli migration:generate --name <MIGRATION_FILE_NAME>

# 4. Run migrations (tables will be created)
npx sequelize-cli db:migrate

<!-- Note:- Import dump of the data in table in DBever -->

# 5. Start server
npm run start