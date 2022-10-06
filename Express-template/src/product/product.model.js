const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    img: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    size: {
        type: String,
        default: "",
    },
    color: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        default: 0,
    },
    sold_in_quantity: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        //required: true
    }
},
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Products", productSchema);

module.exports = Product;