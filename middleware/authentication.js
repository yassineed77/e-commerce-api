const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = (req, res, next) => {
    let token
    const authHeaders = req.headers.authorization

    if(authHeaders || authHeaders.startsWith('Bearer ')){
        // res.status(401).send('invalid credentials')
        token = authHeaders.split(' ')[1]
    } else if(req.cookies.token){
        token = req.cookies.token
    }

    if(!token){
        res.status(401).send('authentication invalid')
    }

    try {
        const payload = jwt.verify(token, 'secretJwt')
        // console.log(payload);
        req.user = { userId: payload.userId, name: payload.name, isAdmin: payload.isAdmin }

        next()
    } catch (error) {
        res.status(401).json({ msg: error })
    }
}

// const isAdmin = async (userId) => {
//     const user = await User.findById(userId)
//     return user
// }

module.exports = { auth }