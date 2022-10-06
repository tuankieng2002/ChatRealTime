const Cart = require('./cart.model');

const createCart = async (cartBody) => {
    return await Cart.create(cartBody);
}

const getCart = async () => {
    return await Cart.find();
}

const getSingleCart = async (cartId) => {
    return await Cart.findById(cartId)
        .populate('user_id', 'full_name address email')
        .populate('product.product_id', 'title price');
}

//
/**
 * Update quantity of product in cart
 * @param {string} cartId
 * @param {string} productId
 * @param {number} quantity
 * @returns
 */
const updateQuantity = async (user_id, productId, quantity) => {
    // return await Cart.findByIdAndUpdate(cartId, cartBody, { new: true });
    return await Cart.findOneAndUpdate({user_id, "product.product_id": productId},{$set: {
        "product.$.quantity": quantity
    }}, {new: true});
}

const deleteCart = async (cartId) => {
    return await Cart.findById(cartId);
}

// Lấy tất cả sản phẩm trong giỏ hàng của 1 người dùng
const getCartByUserId = async (userId) => {
    return await Cart.findOne({ user_id: userId }).select("product -_id");
}

//lấy tất cả product_id trong mảng product
const getAllProductIdInCart = async () => {
    return await Cart.find({}, { product: 1, _id: 0 });
}


module.exports = {
    createCart,
    getCart,
    getSingleCart,
    updateQuantity,
    deleteCart,
    getCartByUserId,
    getAllProductIdInCart,

};