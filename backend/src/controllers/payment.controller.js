const productModel = require('../models/product.model')
const Razorpay = require('razorpay')
const Payment = require('../models/payment.model')


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

async function createOrder(req, res) {
    
    const product = await productModel.findOne()

    const options = {
        amount: product.price.amount,
        currency: product.price.currency
    }

    try{
        const order = await razorpay.orders.create(options)
        res.status(201).json({order})

        // Save order details to database

        const newPayment = await paymentModel.create({
            orderId: order.id,
            price: {
                amount: order.amount,
                currency: order.currency,
            },
            status: 'PENDING'
        })

        res.status(201).json(order)

    } catch(error){
        console.error(error)
        res.status(500).send('Error creating order')
    }
}

async function verifyPayment(req, res){
    
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET

  try {
    const { validatePaymentVerification } = require('../../node_modules/razorpay/dist/utils/razorpay-utils.js')

    const result = validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
    if (result) {
      const payment = await Payment.findOne({ orderId: razorpayOrderId });
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = 'completed';
      await payment.save();
      res.json({ status: 'COMPLETED' });
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error verifying payment');
  }
}

module.exports = {
    createOrder,
    verifyPayment
}