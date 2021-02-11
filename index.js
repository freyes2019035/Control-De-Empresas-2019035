'use strict'
const express = require("express");
const app = express();
const dbService = require("./src/services/db/db.service");
const port = 3000;
const morgan = require('morgan')
const companyRoutes = require("./src/routes/company.routes");
const adminRoutes = require("./src/routes/admin.routes");
const employeeRoutes = require("./src/routes/employee.routes");
const authRoutes = require("./src/routes/auth.routes");

// Method to start the path
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`App listening in port ${port}`);
  });
};
// MiddleWares
app.use(morgan('dev'))
// Routes
app.use("/company", companyRoutes);
app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);
app.use("/auth", authRoutes);
// Start Main App
dbService
  .connectToDb()
  .then((resolved) => {
    if (resolved) {
      console.log(resolved);
      startServer(port);
    }
  })
  .catch((err) => {
    console.error(err);
  });
