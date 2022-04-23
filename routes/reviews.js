const express = require('express')
const { getAll, createReview, getReview, deleteReview, updateReview } = require('../controllers/reviews')
const {auth} = require('../middleware/authentication')
const router = express.Router()

router.route('/reviews/:productId').get(getAll).post(auth, createReview)
router.route('/review/:id').get(getReview).delete(auth, deleteReview)
router.patch('/review/:id/:productId', auth, updateReview)
module.exports = router