const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
            },
            quantity: {
                type: Number,
                default: 1,
            },
        }
    ],
    amount: {//số lượng
        type: Number,
        default: 0,
    },
    address: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "pending",
    },
},
    {
        timestamps: true,
    }
)

const Schema = mongoose.model('Orders', orderSchema);

module.exports = Schema;