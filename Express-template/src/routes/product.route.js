const express = require("express");
const productController = require("../product/product.controller");
const { verifyToken, isAdminOrSales } = require("../middleware/auth")

const router = express.Router();

router.get("/", verifyToken, productController.getProducts);

router.get("/getSingleProduct/:id", verifyToken, productController.getSingleProduct);

router.post("/newProduct", verifyToken, isAdminOrSales, productController.createProduct);

router.put("/updateProduct/:id", verifyToken, isAdminOrSales, productController.updateProduct);

router.delete("/deleteProduct/:id", verifyToken, isAdminOrSales, productController.deleteProduct);

module.exports = router;