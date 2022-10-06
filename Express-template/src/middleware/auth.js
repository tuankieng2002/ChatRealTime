const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../user/user.model');

const Order = require('../order/order.model');
const Cart = require('../cart/cart.model');

const client = require("../helpers/connections_redis");

exports.verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]//cat va lay phan tu thu 2(bearer=0, khoảng trắng=1, token=2)
    if (!token)
        return res
            .status(401)
            .json({ success: false, message: 'Please Login for access this resource' })

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log(error)
        //https://github.com/auth0/node-jsonwebtoken#jsonwebtokenerror
        if (error.name === 'JsonWebTokenError') {
            return res
                .status(401)
                .json({ success: false, message: 'Invalid Token' })
        }

        return res.status(401).json({ success: false, message: 'Invalid token' })
    }
}

exports.signAccessToken = async (userId) => {
    const user = await User.findById(userId)
    return new Promise((resolve, reject) => {//tham số resolve và reject là 2 hàm callback được gọi khi promise được thực thi thành công hoặc thất bại tương ứng với 2 trạng thái resolve và reject là 2 hàm callback được gọi khi promise được thực thi thành công hoặc thất bại tương ứng với 2 trạng thái fulfilled và rejected
        const payload = {
            userId,
            role: user.role
        }
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
            expiresIn: '1d',
            //issuer: 'https://anonystick.com',
        }
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message)
                reject(createError.InternalServerError())
            }
            resolve(token)
        })
    })
}

exports.signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId,
        }
        const secret = process.env.REFRESH_TOKEN_SECRET
        const options = {
            expiresIn: '1y',
            //issuer: 'https://anonystick.com',
        }
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message)
                reject(createError.InternalServerError())
            }
            //EX là thời gian hết hạn của token == expiresIn
            client.set(userId.toString(), token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                if (err) {
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            });
        })
    })
}

//verify token refresh
exports.verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return reject(err);
            }
            client.get(payload.userId, (err, reply) => {
                if (err) {
                    return reject(createError.InternalServerError())
                }
                if (reply === null) {
                    return reject(createError.Unauthorized())
                }
                if (refreshToken === reply) {//so sánh token refresh có trùng với token refresh trong redis không
                    return resolve(payload)//trả về payload của token refresh nếu trùng khớp với token refresh trong redis
                }
                return reject(createError.Unauthorized())
            })
        })
    })
}


// Admin Role
exports.isAdmin = async (req, res, next) => {

    const user = await User.findById(req.userId)

    if (!user.role.includes('admin'))
        return res
            .status(403)
            .json({ success: false, message: 'You are not admin' })

    next()
}

//Lấy chi tiết thông tin của 1 người dùng quyền: admin và chính người dùng đó mới được xem
exports.isAdminOrUser = async (req, res, next) => {
    const user = await User.findById(req.userId)

    if (!user) {
        return res
            .status(404)
            .json({ success: false, message: 'User not found' })
    }

    console.log(req.userId, req.params.id, user.role)
    if (!user.role.includes('admin') && req.userId !== req.params.id) {
        return res
            .status(403)
            .json({ success: false, message: 'You are not the administrator or yourself' })
    }

    next()
}

//Admin or sale
exports.isAdminOrSales = async (req, res, next) => {

    const user = await User.findById(req.userId)
    if (!user.role.includes('admin') && !user.role.includes('sale'))
        return res
            .status(403)
            .json({ success: false, message: 'You are not admin or sale' })

    next()
}

//quyền: admin và chính người dùng đó(order)
exports.isAdminOrUserOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    //console.log(order)
    //lấy thông tin user trong order ra
    const user = await User.findById(req.userId);
    console.log(req.userId, (order.user_id).toString(), user.role)
    if (!user)
        return res
            .status(404)
            .json({ success: false, message: 'User not found' })

    // if(req.userId !== (order.user_id).toString()){
    //     return res
    //         .status(403)
    //         .json({ success: false, message: 'id khong giong nhau' })
    // }

    if (!user.role.includes('admin') && req.userId !== (order.user_id).toString()) {
        return res
            .status(403)
            .json({ success: false, message: 'You are not the administrator or yourself' })
    }
    next()
}

//quyền: admin và chính người dùng đó(cart)
exports.isAdminOrUserCart = async (req, res, next) => {
    const cart = await Cart.findById(req.params.id);
    const user = await User.findById(req.userId);

    //console.log(req.userId, (cart.user_id).toString())

    if (!user) {
        return res
            .status(404)
            .json({ success: false, message: 'User not found' })
    }

    if (!user.role.includes('admin') && req.userId !== (cart.user_id).toString()) {
        return res
            .status(403)
            .json({ success: false, message: 'You are not the administrator or yourself' })
    }

    next()
}