const express = require('express')
const { register, login, logout } = require('../controllers/auth')
const router = express.Router()
const upload = require('../utils/multer')

router.post('/register', upload.single('file'), register)
router.post('/login', login)
router.post('/logout', logout)

module.exports = router