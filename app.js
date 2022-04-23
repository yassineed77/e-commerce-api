const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const productsRouter = require('./routes/products')
const authRouter = require('./routes/auth')
const orderRouter = require('./routes/order')
const reviewRouter = require('./routes/reviews')
const usersRouter = require('./routes/users')
const connectDB = require('./connect')
const auth = require('./middleware/authentication')
// const User = require('./models/User')

var fileupload = require("express-fileupload");

const app = express()

// middleware

app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser(process.env.SECRET_JWT))
app.use(fileupload());
// app.use(cors())

// routes

app.use('/api/v1/products', productsRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1', reviewRouter)



// start

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB('mongodb+srv://Yassine:mernstack@cluster0.r79qd.mongodb.net/e-commerce?retryWrites=true&w=majority')
        app.listen(port, () => {
            console.log('listening on '+ port);
        })
    } catch (err) {
        console.log(err);
    }
}

start()