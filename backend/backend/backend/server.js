require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Dempay server is alive!' });
});

// Create a PaymentIntent
// This is the amount to be charged. In a real app, this would come from a shopping cart or QR code data.
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body; // Expect amount in smallest currency unit (e.g., cents, pence)

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      // In test mode, you can use special cards: https://stripe.com/docs/testing#cards
      automatic_payment_methods: { enabled: true },
    });

    // Send the client secret back to the client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Dempay server running on port ${PORT}`));
