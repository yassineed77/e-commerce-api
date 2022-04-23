const express = require('express')
const { createOrder, payOrder, getOrders, getOrder, getCurrentUserOrders } = require('../controllers/order')
const {auth} = require('../middleware/authentication')
const router = express.Router()

router.post('/', auth, createOrder)
router.post('/pay/:id',  payOrder)
router.get('/', auth, getOrders)
router.get('/:id', auth, getOrder)
router.get('/myOrders', auth, getCurrentUserOrders)

module.exports = router