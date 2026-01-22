##### Setup Instructions #########

# 1. Clone the repository
git clone [<repository_url>](https://github.com/rajeshsharma030225/demo_task.git)
cd [<repository_folder>](demo_task)


# 2. Install Packages
npm i

# 3. Create .env file and set the values
DB_HOST=host
DB_USER=user
DB_PASSWORD=password
DB_NAME=database
DB_PORT=dbport

PORT=3001

# 4. Initialize the migration folder or create manually migrations folder
npx sequelize-cli init

# 5. Generate the migration file
<!-- npx sequelize-cli migration:generate --name create-employees -->
npx sequelize-cli migration:generate --name <MIGRATION_FILE_NAME>

# 6. Run migrations (tables will be created)
npx sequelize-cli db:migrate

<!-- Note:- Import dump of the data in table in DBever -->

# 7. Start server
npm run start



###### API Usage #####################
# 1. Employee Report Listing
Endpoint: GET /api/reports/employees
Query Parameters (Optional)
[
    page, 
    limit, 
    search, 
    department,
    jobTitle,
    salary,
    hireStartDate,
    hireEndDate,
    minSalary,
    maxSalary,
    gender,
    sortBy, (empNo, hireDate, salary, department)
    sortOrder,(ASC or DESC)
    exportIn (csv or excel)
]

# 2. Salary Growth of Employee
Endpoint: GET /api/reports/employees/:empNo/salary-growth

# 3. Average Salary by Department
Endpoint: GET /api/reports/departments/salary-average

# 4. Historical Employee Data
Endpoint: GET /api/reports/employees/:empNo/history-comaprison

# 5. Import CSV file
Endpoint: POST /api/reports/employees/importCsv
Content-Type: multipart/form-data
Body:
    -   file: CSV file
Required CSV Headers:- [First name, Last name, Birth date, Gender, Hire date,
Department name, Job title, Salary, From date, To date]


######  Export Instructions ##############
# 1. CSV Export 
- Add query parameter:
Endpoint: GET - /api/reports/employees?exportIn=csv

# 1. Excel Export 
- Add query parameter:
Endpoint: GET - /api/reports/employees?exportIn=excel

###### Validations & Notes #########
-   Dates must be in YYYY-MM-DD format
-   Salary must be numeric
-   Gender must be M or F
-   Hire date must be at least 18 years after birth date
-   From date cannot be earlier than hire date
-   To date cannot be earlier than from date


###### Tech Stack ##################
-   Node.js
-   Express
-   Sequelize
-   MySQL
-   Multer (CSV upload)
-   ExcelJS (Excel export)