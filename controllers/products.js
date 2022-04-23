// const { isAdmin } = require('../middleware/authentication')
const Product = require('../models/Product')
const User = require('../models/User')
const StatusCodes = require('http-status-codes')
const path = require('path')

const getAll = async (req, res) => {
    // const result = await Product.find({})
    // res.status(200).json({result})
    try {
        const { isAvailable, name, sort, fields, numFields } = req.query
        let queryObj = {}

        if(isAvailable){
            queryObj.isAvailable = isAvailable === 'true' ? true : false
        }

        if(name){
            queryObj.name = { $regex: name, $options: 'i' }
        }

        if(numFields){
            const operators = {
                '>': '$gt',
                '>=': '$gte',
                '=': '$eq',
                '<': '$lt',
                '<=': '$lte',
            }
            const regEx = /\b(<|>|>=|=|<|<=)\b/g;
            let filters = numFields.replace(
                regEx,
                (match) => `-${operators[match]}-`
            );
            const options = ['price', 'rating'];
            filters = filters.split(',').forEach((item) => {
                const [field, operator, value] = item.split('-');
                if (options.includes(field)) {
                    queryObj[field] = { [operator]: Number(value) };
                }
            });

        }

        let result = Product.find(queryObj)


        if(sort){
            result = result.sort(sort.split(',').join(' '))
        } else {
            result = result.sort('createdAt')
        }

        if(fields){
            result = result.select(fields.split(',').join(' '))
        }

        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        result = result.limit(limit).skip(skip)

        console.log(skip);

        const products = await result
        res.status(200).json({ products, nbHits: products.length })
    } catch (error) {
        res.status(500).json({ msg: error })
    }
}

const createProduct = async (req, res) => {
    // const result = new User.create(req.body)
    // await result.save()

    if(!req.user.isAdmin){
        res.status(400).send('not an admin sir t9awed')
    }
    console.log(req.files);

    req.body.createdBy = req.user.userId
    const result = await Product.create(req.body)

    res.status(201).json({result})
}

const uploadImg = async (req, res) => {

    if(!req.user.isAdmin){
        res.status(StatusCodes.UNAUTHORIZED).send('not an admin sir t9awed')
    }

    console.log(req.body.product);
    if (!req.files) {
        res.status(StatusCodes.BAD_REQUEST).send('provide image')
    }
    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith('image')) {
      res.status(StatusCodes.BAD_REQUEST).send('Please Upload Image');
    }

    // const maxSize = 1024 * 1024;

    // if (productImage.size > maxSize) {
    //   throw new CustomError.BadRequestError(
    //     'Please upload image smaller than 1MB'
    //   );
    // }

    const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
    );
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });

    const product = await Product.findById(req.body.product)

    product.image = `/uploads/${productImage.name}`
    await product.save()
};

const getProduct = async (req, res) => {
    const result = await Product.findById(req.params.id).populate('reviews');

    if(!result){
        return res.status(500).send(`no product with the id ${req.params.id}`)
    }

    res.status(200).json(result)
}

const deleteProduct = async (req, res) => {
    const user = await User.findById(req.user.userId)
    console.log(user);

    if(!user.isAdmin){
        res.status(400).send('not an admin sir t9awed')
    }

    const result = await Product.findByIdAndDelete(req.params.id)

    if(!result){
        return res.status(500).send(`no product with the id ${req.params.id}`)
    }

    res.status(200).json("deleted successfully")
}

const updateProduct = async (req, res) => {
    const user = await User.findById(req.user.userId)
    console.log(user);

    if(!user.isAdmin){
        res.status(400).send('not an admin sir t9awed')
    }
    
    const result = await Product.findByIdAndUpdate({ _id: req.params.id}, req.body)

    if(!result){
        return res.status(500).send(`no product with the id ${req.params.id}`)
    }

    res.status(200).json("updated successfully")
}

module.exports = {
    getAll,
    createProduct,
    getProduct,
    deleteProduct,
    updateProduct,
    uploadImg
}