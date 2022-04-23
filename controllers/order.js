const Order = require('../models/Order')
const Product = require('../models/Product')
const StatusCodes = require('http-status-codes')


const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    res.status(404).send('no cart items povided')
  }
  if (!tax || !shippingFee) {
    res.status(404).send('must provide tax and shipping fee')
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
        res.status(400).send(`no item with id ${_id}`)
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(201)
    .json({ order, clientSecret: order.clientSecret });
};

const getOrders = async (req, res) => {
  if(!req.user.isAdmin){
    res.status(400).send('not an admin sir t9awed')
  }

  const orders = await Order.find({})
  res.status(200).send(orders)
}

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)

  if(order.user.toString() !== req.user.userId || !req.user.isAdmin){
    res.status(StatusCodes.UNAUTHORIZED).send('sir t9awed')
  }

  if(!order){
    res.status(StatusCodes.NOT_FOUND).send(`no item with id ${req.params.id}`)
  }

  res.status(StatusCodes.OK).send(order)
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
  res.status(StatusCodes.OK).send(orders)
}



const payOrder = async (req, res) => {
    const order = await Order.findById(req.params.id)
    const orders = []
    const orderPromise = order.productsNbr.map( async item => {
        const product = await Product.findById(item)
        orders.push({ name: product.name, price: product.price })
    })
    return Promise.all(orderPromise).then(async () => {
        try {
            const session = await stripe.checkout.sessions.create({
              payment_method_types: ["card"],
              mode: "payment",
              line_items: orders.map(item => {
                // const storeItem = Product.findById(item)
                return {
                  price_data: {
                    currency: "usd",
                    product_data: {
                      name: item.name,
                    },
                    unit_amount: item.price,
                  },
                  quantity: 1,
                }
              }),
              success_url: 'http://localhost:5000/api/v1/products',
              cancel_url: `http://localhost:5000/api/v1/users`,
            //   success_url: `${process.env.CLIENT_URL}/success.html`,
            //   cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
            })
            res.json({ url: session.url })
        } catch (e) {
          res.status(500).json({ error: e.message })
        }
    })
}

module.exports = { createOrder, payOrder, getOrder, getOrders, getCurrentUserOrders }