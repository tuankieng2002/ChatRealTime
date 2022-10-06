const Order = require('./order.model');

const createOrder = async (orderBody) => {
    return await Order.create(orderBody);
}

const getOrder = async () => {
    return await Order.find();
}

const getSingleOrder = async (orderId) => {
    return await Order.findById(orderId).populate('user_id', 'full_name').populate('products.product_id', 'title price');
}

const updateStatusOrder = async (orderId, orderBody) => {
    return await Order.findByIdAndUpdate(orderId, orderBody, { new: true });
}

const deleteOrder = async(orderId) => {
    return await Order.findById(orderId);
}

const updateOrder = async (orderId, orderBody) => {
    return await Order.findByIdAndUpdate(orderId, orderBody, { new: true });
}

module.exports = {
    createOrder,
    getOrder,
    getSingleOrder,
    updateStatusOrder,
    deleteOrder,
    updateOrder,
};