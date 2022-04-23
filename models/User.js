const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must provide name']
    },
    email: {
        type: String,
        required: [true, 'must provide email'],
        unique: true,
        // match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        //     'must provide a valid email'
        // ],
        validate: {
            validator: validator.isEmail,
            message: 'provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'must provide password']
    },
    profilePic: {
        type: String,
        // required: [true, 'must provide profile pic']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})


UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.name, isAdmin: this.isAdmin },
        // process.env.SECRET_JWT,
        "secretJwt",
        {
        // expiresIn: process.env.JWT_LIFETIME,
        expiresIn: "30d",
        }
    )
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}


module.exports = mongoose.model('User', UserSchema)