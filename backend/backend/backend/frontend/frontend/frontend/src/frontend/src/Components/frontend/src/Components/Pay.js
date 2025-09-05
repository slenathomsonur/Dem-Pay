import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

const Pay = () => {
  const stripe = useStripe();
  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState('');

  // On component mount, create a Payment Intent for $5.00 on the server
  useEffect(() => {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create-payment-intent`, { amount: 500 }) // $5.00 in cents
      .then(response => {
        setClientSecret(response.data.clientSecret);
      })
      .catch(error => {
        console.error('Error creating payment intent:', error);
        setMessage('Failed to initialize payment.');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !clientSecret) return;

    setMessage('Processing payment...');

    // Confirm the payment using the client secret
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: await stripe.createPaymentMethod({ type: 'card' }).then(res => res.paymentMethod.id),
        // In a real app, you would use a previously saved payment method ID here.
      }
    });

    if (error) {
      setMessage(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === 'succeeded') {
      setMessage('Payment successful! ✅');
    }
  };

  return (
    <div>
      <h3>Simulate a QR Code Payment</h3>
      <p>This will charge the test card $5.00.</p>
      <button onClick={handleSubmit} disabled={!stripe || !clientSecret}>
        Pay Now
      </button>
      {message && <div id="payment-message">{message}</div>}
    </div>
  );
};

export default Pay;
