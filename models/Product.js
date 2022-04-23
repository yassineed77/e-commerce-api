const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'please login']
    }
},
{ timestamps: true }
)


ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
  });
  
ProductSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
});  

module.exports = mongoose.model('Product', ProductSchema)