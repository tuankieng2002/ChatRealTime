const express = require("express");
const orderController = require("../order/order.controller");
const { verifyToken, isAdminOrSales, isAdminOrUserOrder, isAdmin } = require("../middleware/auth")

const router = express.Router();

//Tạo đơn hàng ---Admin|Sales
router.post("/createNew", verifyToken, isAdminOrSales, orderController.createOrder);

//Lấy tất cả đơn hàng ---Admin
router.get("/", verifyToken, isAdmin, orderController.getOrder);

//Lấy tất cả đơn hàng của 1 người dùng ---Admin
router.get("/getSingleOrder/:id", verifyToken, isAdmin, orderController.getSingleOrder);

//Cập nhật trạng thái đơn hàng
router.put("/update-status-order/:id", verifyToken, isAdminOrSales, orderController.updateStatusOrder);

//Cập nhật thông tin đơn hàng ---Admin|User
router.put('/update-order/:id', verifyToken, isAdminOrUserOrder, orderController.updateOrder);

//Xoá đơn hàng ---Admin|User
router.delete('/deleteOrder/:id', verifyToken, isAdminOrUserOrder, orderController.deleteOrder);

module.exports = router;