const httpStatus = require("http-status");
const productService = require("./product.service");

//Create product
const createProduct = async (req, res, next) => {
    console.log(req.body);

    const product = await productService.createProduct(req.body);

    try {
        return res.status(httpStatus.CREATED).json({
            status: httpStatus.CREATED,
            message: "success",
            data: product
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//get all products
const getProducts =  async (req, res, next) => {
    const products = await productService.getProducts();

    try {
        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: products
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//get single product
const getSingleProduct = async (req, res, next) => {
    const singleProduct = await productService.getSingleProduct(req.params.id);

    if (!singleProduct){
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
            data: singleProduct
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//update product information
const updateProduct = async (req, res, next) => {
    console.log(req.body);
    const idProduct = req.params.id;
    console.log(idProduct);

    const product = await productService.updateProduct(idProduct, req.body);
    //bắt lỗi sai id product
    if (!idProduct) {
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
            data: product
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: error.message,
            data: null,
        });
    }
}

//delete product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        product.remove();
        if(!product){
            return res.status(httpStatus.NOT_FOUND).json({
                status: httpStatus.NOT_FOUND,
                message: "Product not found",
                data: null,
            });
        }

        return res.status(httpStatus.OK).json({
            status: httpStatus.OK,
            message: "success",
            data: product
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
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
}