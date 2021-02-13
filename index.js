'use strict'
const express = require("express");
const app = express();
const dbService = require("./src/services/db/db.service");
const port = 3000;
const morgan = require('morgan')
const companyRoutes = require("./src/routes/company.routes");
const userRoutes = require("./src/routes/user.routes");
const employeeRoutes = require("./src/routes/employee.routes");
const authRoutes = require("./src/routes/auth.routes");
const bodyParser = require('body-parser')
const createUser = require('./src/components/user/user.controller')

// Method to start the path
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`App listening in port ${port}`);
  });
};
const createAdminUser = async () => {
  await createUser.createAdmin('Admin', '123456', 'admin');
}
// Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// MiddleWares
app.use(morgan('dev'))
// Routes
app.use("/company", companyRoutes);
app.use("/users", userRoutes);
app.use("/employee", employeeRoutes);
app.use("/auth", authRoutes);
// Start Main App
dbService
  .connectToDb()
  .then((resolved) => {
    if (resolved) {
      console.log(resolved);
      startServer(port);
      createAdminUser();
    }
  })
  .catch((err) => {
    console.error(err);
  });
