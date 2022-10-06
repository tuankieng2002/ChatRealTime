const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    //product là object chứa id và số lượng của sản phẩm trong giỏ hàng của 1 người dùng
    product: {
        type: [{
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        _id: false
    }

    //cách láy product_id trong mảng product
    // const product_id = cart.product.map((item) => {
    //     return item.product_id;
    // })

    //nếu sản phẩm đã có rồi thì cộng dồn số lượng, còn chưa thì push thêm vào
    //dựa vòa id product lấy tất cả sản phẩm chứa id product đó trong giỏ hàng của 1 người dùng
    //muốn làm gì thì code trong service tương ứng

},
    {
        timestamps: true,
    }
);

const Cart = mongoose.model('Carts', cartSchema);

module.exports = Cart;