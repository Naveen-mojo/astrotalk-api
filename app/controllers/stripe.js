const Stripe = require("stripe");
const Order = require("../models/stripe.model");
const stripe = Stripe("sk_test_51LpoOQSCkptFWpk2yUOUAKc1UDTdwZ6SzleVz9TG7BnQWbEr4sOpNdZweiF0Ba16GLhugR9Zs8pLzo7P39fjq24p00IfBRUdn1")



exports.stripePayment = async (req, res) => {
  try {

    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.product.userId,
        product: JSON.stringify(req.body.product)
      }
    })

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: req.body.product.name,
            },
            unit_amount: req.body.product.price,
          },
          quantity: 1,
        },
      ],
      billing_address_collection: "auto",
      customer: customer.id,
      mode: 'payment',
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    res.send({ url: session.url });
  } catch (error) {
    console.log(error)
  }
};


exports.webhooks = async (req, res) => {

  let endpointSecret;
  endpointSecret = "whsec_b5c99628396302e225478f1a5ba7bb3e97703dbbb8b350c4d80a09b85ff1382d";

  const createOrder = async (customer, data) => {
    const items = JSON.parse(customer.metadata.product)

    const newOrder = new Order({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      product: items,
      subTotal: data.amount_subtotal,
      total: data.amount_total,
      payment_status: data.payment_status
    });

    try {
      const saveOrder = await newOrder.save();
      console.log("Proceed Order: ", saveOrder)
    } catch (error) {
      console.log(error)
    }

  }

  const sig = req.headers['stripe-signature'];

  let eventType;

  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }


  if (eventType === 'checkout.session.completed') { 
    stripe.customers.retrieve(data.customer).then((customer) => {
      createOrder(customer, data)
    }).catch((err) => {
      console.log(err)
    });
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send().end();

}