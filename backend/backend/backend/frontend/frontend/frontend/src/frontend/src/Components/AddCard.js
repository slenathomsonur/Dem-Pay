import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const AddCard = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    // Create a payment method using the CardElement
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error('[error]', error);
      alert(`Error: ${error.message}`);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      alert('Card added successfully! (Check console for details)');
      // In a real app, you would send this paymentMethod.id to your server to save to a customer
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a Test Card</h3>
      <p>Use card number <code>4242 4242 4242 4242</code> with any future expiry and CVC.</p>
      <div style={{ width: '400px', margin: '20px auto' }}>
        <CardElement
          options={{
            style: {
              base: { fontSize: '16px', color: '#424770' },
            },
          }}
        />
      </div>
      <button type="submit" disabled={!stripe}>
        Add Card
      </button>
    </form>
  );
};

export default AddCard;
