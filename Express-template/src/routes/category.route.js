const express = require("express");
const categoryController = require("../category/category.controller");
const { verifyToken, isAdminOrSales } = require("../middleware/auth")

const router = express.Router();

router.get("/", verifyToken, categoryController.getCategory);

router.get("/getSingleCategory/:id", verifyToken, categoryController.getSingleCategory);

router.post("/newCategory", verifyToken, isAdminOrSales, categoryController.createCategory);

router.put("/updateCategory/:id",  verifyToken, isAdminOrSales, categoryController.updateCategory);

router.delete("/deleteCategory/:id", verifyToken, isAdminOrSales, categoryController.deleteCategory);



module.exports = router;