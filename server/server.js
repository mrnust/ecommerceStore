const express = require('express');
const stripe = require('stripe')('sk_test_51OPInkDkA3rml0kyoLHDU7HbXeYaRevGNengkr0JgpxDcvZuJeyP7tRRqhHge46XS6gL8dQ0kGhx46VRyRaB45HF00CZBTLJ1K');
const cors = require('cors');

const app = express();
const port = 3001; // Choose any port you prefer

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.get('/create-payment-intent', async (req, res) => {
  try {
    const paymentAmount = req.query.amount || 1599;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating Payment Intent:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`   );
});