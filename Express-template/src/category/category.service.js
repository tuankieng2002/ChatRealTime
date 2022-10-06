const Category = require('./category.model');

const createCategory = async (categoryBody) => {
    return await Category.create(categoryBody);
}

const getCategory = async () => {
    return await Category.find()
}

const getSingleCategory = async (categoryId) => {
    return await Category.findById(categoryId);
}

const updateCategory = async (categoryId, categoryBody) => {
    return await Category.findByIdAndUpdate(categoryId, categoryBody, { new: true })
}

const deleteCategory = async (categoryId) => {
    return await Category.findById(categoryId)
}

module.exports = {
    createCategory,
    getCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
};