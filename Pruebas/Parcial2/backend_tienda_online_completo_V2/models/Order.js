const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: [
        {
            productId: String,
            quantity: Number,
            price: Number
        }
    ],
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);