"use strict";
const express = require("express");
const router = express.Router();
const employeeController = require("../components/employee/employee.controller");
const auth_middleWare = require("../middlewares/auth.middleware");
router.get("/",auth_middleWare.ensureAuth,employeeController.getEmployees);
router.get("/:id", auth_middleWare.ensureAuth, employeeController.getEmployee);
router.get("/name/:name", auth_middleWare.ensureAuth,employeeController.getEmployeeByName);
router.get("/compnay/position/:position", auth_middleWare.ensureAuth,employeeController.getEmployeeByPosition);
router.get(
  "/departament/:departament",
  employeeController.getEmployeeByDepartament
);
router.post("/", auth_middleWare.ensureAuth, employeeController.createEmployee);
router.put(
  "/:id",
  auth_middleWare.ensureAuth,
  employeeController.updateEmployee
);
router.delete(
  "/:id",
  auth_middleWare.ensureAuth,
  employeeController.deleteEmployee
);

module.exports = router;
