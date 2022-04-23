const express = require('express')
const { getAll, createProduct, getProduct, deleteProduct, updateProduct, uploadImg } = require('../controllers/products')
const { auth } = require('../middleware/authentication')
const router = express.Router()

router.get('/', getAll)

router.post('/', auth, createProduct)

router.get('/:id', getProduct)

router.delete('/:id', deleteProduct)

router.patch('/:id', updateProduct)

router.post('/uploadImg', auth, uploadImg)

module.exports = router