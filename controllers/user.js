const User = require("../models/User")
const StatusCodes = require('http-status-codes')


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


const getUsers = async (req, res) => {
    const users = await User.find({})
    res.status(StatusCodes.OK).send({users})
}

const showCurrentUser = (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user})
}

const updateUser = async (req, res) => {
    const { name, email } = req.body

    if(!name || !email){
        res.status(StatusCodes.BAD_REQUEST).send('provide the necessery')
    }
    const user = await User.findById(req.user.userId)

    user.email = email
    user.name = name

    await user.save()

    const token = user.createJWT()

    attachCookiesToResponse({ res, token: token })

    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

const updatePassword = async (req, res) => {
    const { oldPass, newPass } = req.body
    if(!oldPass || !newPass) {
        req.status(StatusCodes.BAD_REQUEST).send('controllers > user 51')
    }

    const user = await User.findById(req.user.userId)

    const isPassCorrect = await user.comparePassword(oldPass)

    if(!isPassCorrect){
        res.status(StatusCodes.UNAUTHORIZED).send('password incorrect')
    }

    user.password = newPass

    await user.save()
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
}

module.exports = { getUsers, showCurrentUser, updateUser, updatePassword }