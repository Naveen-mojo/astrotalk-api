const db = require('../models');
const { paymenthistory: StripeModel } = db;
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51LpoOQSCkptFWpk2yUOUAKc1UDTdwZ6SzleVz9TG7BnQWbEr4sOpNdZweiF0Ba16GLhugR9Zs8pLzo7P39fjq24p00IfBRUdn1")
require('dotenv')

const {updateWallet} = require('./userwallet.controller')

// exports.stripePayment = async (req, res) => {
//   try {

//     const customer = await stripe.customers.create({
//       metadata: {
//         userId: req.body.product.userId,
//         product: JSON.stringify(req.body.product)
//       }
//     })
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: 'USD',
//             product_data: {
//               name: req.body.product.name,
//             },
//             unit_amount: req.body.product.price * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       billing_address_collection: "auto",
//       customer: customer.id,
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/success`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });

//     res.send({ url: session.url });
//   } catch (error) {
//     console.log(error)
//   }
// };


// exports.webhooks = async (req, res) => {

//   let endpointSecret;
//   endpointSecret = "whsec_b5c99628396302e225478f1a5ba7bb3e97703dbbb8b350c4d80a09b85ff1382d";

//   const createOrder = async (customer, data) => {
//     const items = JSON.parse(customer.metadata.product)

//     const newOrder = new Order({
//       userId: customer.metadata.userId,
//       customerId: data.customer,
//       paymentIntentId: data.payment_intent,
//       product: items,
//       subTotal: data.amount_subtotal,
//       total: data.amount_total,
//       payment_status: data.payment_status
//     });

//     try {
//       const saveOrder = await newOrder.save();
//       console.log("Proceed Order: ", saveOrder)
//     } catch (error) {
//       console.log(error)
//     }

//   }

//   const sig = req.headers['stripe-signature'];

//   let eventType;

//   if (endpointSecret) {
//     let event;
//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//       res.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     data = event.data.object;
//     eventType = event.type;
//   } else {
//     data = req.body.data.object;
//     eventType = req.body.type;
//   }


//   if (eventType === 'checkout.session.completed') {
//     stripe.customers.retrieve(data.customer).then((customer) => {
//       createOrder(customer, data)
//     }).catch((err) => {
//       console.log(err)
//     });
//   }

//   // Return a 200 res to acknowledge receipt of the event
//   res.send().end();

// }


exports.stripePaymentNew = async (req, res) => {

  try {
    // Create the PaymentIntent
    let intent = await stripe.paymentIntents.create({
      payment_method: req.body.payment_method_id,
      description: "Test payment",
      amount: req.body.amount * 100,
      currency: 'inr',
      confirmation_method: 'manual',
      confirm: true,
    });

    const stripeData = new StripeModel({
      id: intent.id,
      name: req.body.name,
      email: req.body.email,
      userId: req.body.userId,
      amount: req.body.amount,
      amount_received: intent.amount_received,
      created: intent.created,
      currency: intent.currency,
      payment_method: intent.payment_method,
      payment_method_types: intent.payment_method_types,
      status: intent.status
    });

    try {
      const savedData = await stripeData.save();
      // Send the res to the client
      res.send(generateResponse(intent));
      updateWallet(stripeData.amount, true, stripeData.amount, "stripe", stripeData.userId)

    } catch (err) {
      res.status(500).json(err);
    }

  } catch (e) {
    // Display error on client
    return res.send({ error: e.message });
  }
};

const generateResponse = (intent) => {
  if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true
    };
  } else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status'
    };
  }
}

exports.paymentHistroy = async (req, res) => {
  try {
    const _id = req.params.id
    const data = await StripeModel.find({ userId: _id })
    res.status(200).send(data)
  } catch (error) {
    return res.send({ error: error.message });
  }
}