const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide product name"],
        trim: true,
        maxlength: [120, "Product name should not be more than 120 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please provide product price"],
        maxlength: [5, "Product price should not be more than 5 digit number"]
    },
    description: {
        type: String,
        required: [true, "Please provide product description"],
        trim: true
    },
    photos: [{
        id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Please select product category from - short-sleeves, long-sleeves, sweat-shirty, hoodies"],
        enum: {
            values: [
                'short sleeves',
                'long sleeves',
                'sweat shirt',
                'hoodies'
            ],
            message: 'Please select product category from - short-sleeves, long-sleeves, sweat-shirty, hoodies'
        }
    },
    brand: {
        type: String,
        required: [true, "please add brand for clothing"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'user',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('product', productSchema)