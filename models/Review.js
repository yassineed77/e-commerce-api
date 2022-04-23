const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: [true, 'login al7mar']
    },
    product: {
        type: mongoose.Types.ObjectId,
        required: [true, 'provide product']
    }
})

module.exports = mongoose.model('Review', ReviewSchema)