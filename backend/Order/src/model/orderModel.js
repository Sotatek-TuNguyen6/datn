const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    productId:{
        type: String,
        require: true,
    },
    
})