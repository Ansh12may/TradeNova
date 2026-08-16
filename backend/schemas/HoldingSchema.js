const { Schema } = require("mongoose");

const HoldingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    
    qty: {
        type: Number,
        required: true,
        min: 0,
    },

    avg: {
        type: Number,
        required: true,
        min: 0,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    net: String,
    day: String,
});

module.exports = { HoldingSchema };