const { getUsers, showCurrentUser, updateUser, updatePassword } = require('../controllers/user')
const {auth} = require('../middleware/authentication')

const router = require('express').Router()

router.get('/', getUsers)
router.get('/current', auth, showCurrentUser)
router.patch('/', auth, updateUser)
router.patch('/password', auth, updatePassword)

module.exports = router
