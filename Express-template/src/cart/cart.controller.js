const httpStatus = require("http-status");
const cartService = require('./cart.service');
const Cart = require('./cart.model');

const Product = require('../product/product.model');

//Create cart
const createCart = async (req, res, next) => {
    //console.log(req.body);
    //nếu product_id đã tồn tại trong cart thì update cộng dồn thêm quantity trong product ngược lại thì Push thêm vào mảng product

    const cart = await Cart.findOne({user_id: req.body.user_id});//lấy ra cart của user_id đó nếu có rồi thì update quantity của product đó còn nếu chưa có thì tạo mới cart và push product vào mảng product của cart đó
    //console.log(cart);
    if(cart){
        const product = cart.product.find((item) => {//find() trả về phần tử đầu tiên trong mảng thỏa mãn điều kiện của hàm callback nếu không tìm thấy thì trả về undefined
            //vd: const array1 = [5, 12, 8, 130, 44];
            //const found = array1.find(element => element > 10);
            //console.log(found);
            // expected output: 12
            // console.log(item.product_id);
            // console.log(req.body.product.product_id);
            console.log(cart)
            return item.product_id == req.body.product.product_id;//so sánh cái id của product trong cart với cái id của product mình muốn thêm vào cart.

        });
        if(product) {
            for (let cartProduct of cart.product){
                if(cartProduct.product_id == req.body.product.product_id){
                    cartProduct.quantity += req.body.product.quantity;
                    //== cartProduct.quantity = cartProduct.quantity + req.body.product.quantity
                }
            }
            await cart.save();
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "success",
                data: cart
            });
        }else{
            cart.product.push(req.body.product);
            //console.log(cart.product)
            await cart.save();
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "success",
                data: cart
            });
        }
    }else{
        const cart = await cartService.createCart(req.body);
        try {
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "thanh cong",
                data: cart
            });
        } catch (error) {
            return res.status(httpStatus.BAD_REQUEST).json({
                status: httpStatus.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
    }
}


//Get cart
const getCart = async (req, res, next) => {
    const cart = await cartService.getCart();

    if(!cart) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "Cart not found",
            data: null,
        });
    }

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: cart
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
};

const getSingleCart = async (req, res, next) => {
    const cart = await cartService.getSingleCart(req.params.id);

    if(!cart){
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "Cart not found",
            data: null,
        });
    }

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: cart
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

// update quantity of product in cart
const updateCart = async (req, res, next) => {
    //update quantity of product in cart
    const cart = await cartService.updateQuantity(req.params.id, req.body.product_id, req.body.quantity);

    console.log(cart);

    if(!cart){
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "Cart not found",
            data: null,
        });
    }

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: cart
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//xóa sản phẩm trong giỏ hàng
const deleteCart = async (req, res, next) => {
    const cart = await cartService.deleteCart(req.params.id);

    await cart.remove();

    if(!cart){
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "Cart not found",
            data: null,
        });
    }

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: cart
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

// Lấy tất cả sản phẩm trong giỏ hàng của 1 người dùng
const getCartByUserId = async (req, res, next) => {
    const cart = await cartService.getCartByUserId(req.params.id);

    if(!cart){
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "Cart not found",
            data: null,
        });
    }

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: cart
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//lấy tất cả product_id trong cart
const getAllProductIdInCart = async (req, res, next) => {
    const cart = await cartService.getAllProductIdInCart(req.params.id);
    console.log(cart);

    if(!cart){
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: "Cart not found",
            data: null,
        });
    }

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: cart
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

module.exports = {
    createCart,
    getCart,
    getSingleCart,
    updateCart,
    deleteCart,
    getCartByUserId,
    getAllProductIdInCart
}