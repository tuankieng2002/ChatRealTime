const Product = require('./product.model');

const createProduct = async (productBody) => {
    return await Product.create(productBody);
}

const getProducts = async () => {
    return await Product.find()
}

const getSingleProduct = async (productId) => {
    return await Product.findById(productId).populate('category', 'name');
}

const updateProduct = async (productId, productBody) => {
    return await Product.findByIdAndUpdate(productId, productBody, { new: true });
}

const deleteProduct = async (productId) => {
    return await Product.findById(productId)
}

module.exports = {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};