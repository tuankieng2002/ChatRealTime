const httpStatus = require("http-status");
const orderService = require("./order.service");
const Product = require("../product/product.model");

//Create new order
const createOrder = async (req, res, next) => {
    console.log(req.body);
    const order = await orderService.createOrder(req.body);
    try {
        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "success",
            data: order
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//get all orders ---Admin only
const getOrder = async (req, res) => {
    const order = await orderService.getOrder();
    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: order
        });
    }
    catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//get Single Order
const getSingleOrder = async (req, res) => {
    const order = await orderService.getSingleOrder(req.params.id);
    if (!order) {
        return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "Order not found",
            data: null,
        });
    }
    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: order
        });
    }
    catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//Update order status ---Admin
const updateStatusOrder = async (req, res) => {
    try {
        const order = await orderService.updateStatusOrder(req.params.id, req.body);

        if (!order) {
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "Order not found",
                data: null,
            });
        }

        if (order.status === "shipping") {
            return res.status(httpStatus.OK).json({
                status: httpStatus.OK,
                message: "Order is shipping",
                data: order
            });
        }

        if (order.status === "success") {
            order.products.forEach(async (product) => {//forEach dùng để duyệt qua các phần tử của mảng product và thực hiện hàm updateQuantity với 2 tham số là id và quantity của product đó còn hàm updateQuantity là hàm update số lượng sản phẩm đã bán trong database
                await updateQuantity(product.product_id, product.quantity);//product_id lấy từ order.model.js ở dòng 12
            });
        }


        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: order
        });
    }
    catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

const updateQuantity = async (id, quantity) => {
    const product = await Product.findById(id);

    product.sold_in_quantity -= quantity;

    if (product.sold_in_quantity < 0) {
        product.sold_in_quantity = 0;
    }

    await product.save({ validateBeforeSave: false });
}

//Delete order ---Admin
const deleteOrder = async (req, res) => {
    const order = await orderService.deleteOrder(req.params.id);

    if (!order) {
        return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "Order not found",
            data: null,
        });
    }

    await order.remove();
    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: order
        });
    }
    catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//Update order ---User --Admin
const updateOrder = async (req, res) => {
    console.log(req.body);

    try {
        const amount = req.body.amount;
        const address = req.body.address;
        const order = await orderService.updateOrder(req.params.id, { amount, address });

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: order
        });
    }
    catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

module.exports = {
    createOrder,
    getOrder,
    getSingleOrder,
    updateStatusOrder,
    deleteOrder,
    updateOrder
};