const User = require('../models/User')
const cloudinary = require('../utils/cloudinary')
const jwt = require('jsonwebtoken')
const StatusCodes = require('http-status-codes')


// const createJWT = ({ payload }) => {
//     const token = jwt.sign(payload, process.env.SECRET_JWT, {
//       expiresIn: "30d",
//     });
//     return token;
//   };

const attachCookiesToResponse = ({ res, token }) => {
    // const token = user.createJWT()
  
    const oneDay = 1000 * 60 * 60 * 24;
  
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    });
};

const register = async (req, res) => {
    try {
        // const result = await cloudinary.uploader(req.file.path)

        console.log(req.file);

        const user = await User.create({
            name: req.body.username || 'username',
            email: req.body.email || 'email@gmail.com',
            password: req.body.password || 'password',
            profilePic: req.body.profilePic || 'pic',
        })
        // const token = user.createJWT()

        attachCookiesToResponse({ res, user: user })

        res.status(200).send({ user: { name: user.name }, token })
    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(401).send('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        res.status(401).send('Invalid Credentials')
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        res.status(401).send('Invalid Credentials')
    }
    const token = user.createJWT()

    attachCookiesToResponse({ res, token: token })

    res.status(200).json({ user: { name: user.name }, token })
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
  };

module.exports = { register, login, logout }