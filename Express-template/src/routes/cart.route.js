const express = require("express");
const cartController = require('../cart/cart.controller');
const { verifyToken, isAdmin, isAdminOrUserCart } = require("../middleware/auth");

const router = express.Router();

router.post("/createNew", verifyToken, cartController.createCart);

//** quyền: admin
router.get('/', verifyToken, isAdmin, cartController.getCart);

router.get('/getSingleCart/:id', verifyToken, cartController.getSingleCart);

router.put('/updateCart/:id', verifyToken, isAdminOrUserCart, cartController.updateCart);

router.delete('/deleteCart/:id', verifyToken, isAdminOrUserCart, cartController.deleteCart);

//** quyền: admin và chính người dùng đó
router.get('/getCartByUserId/:id', verifyToken, cartController.getCartByUserId);


//get all product_id in cart
// router.get("/getAllProductIdInCart/:id", cartController.getAllProductIdInCart);

//lấy tất cả product, dựa vào product lấy tất cả product_id ra so sanh
//lấy tất cả product_id trong cart
router.get("/getAllProductIdInCart", cartController.getAllProductIdInCart);

module.exports = router;