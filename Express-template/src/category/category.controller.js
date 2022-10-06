const httpStatus = require("http-status");
const categoryService = require("./category.service");

//Create category
const createCategory = async (req, res, next) => {
    console.log(req.body);
    const category = await categoryService.createCategory(req.body);
    try {
        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "success",
            data: category
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//get all categories
const getCategory =  async (req, res, next) => {
    const category = await categoryService.getCategory();

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: category
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//get single category
const getSingleCategory = async (req, res, next) => {
    const singleCategory = await categoryService.getSingleCategory(req.params.id);

    if (!singleCategory) {
        return res.status(httpStatus.NOT_FOUND).json({
            status: httpStatus.NOT_FOUND,
            message: "Product not found",
            data: null,
        });
    }

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: singleCategory
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//update category information
const updateCategory = async (req, res, next) => {
    console.log(req.body);
    const category = await categoryService.updateCategory(req.params.id, req.body);

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: category
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//delete category
const deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        category.remove();

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: category
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

module.exports ={
    createCategory,
    getCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
}