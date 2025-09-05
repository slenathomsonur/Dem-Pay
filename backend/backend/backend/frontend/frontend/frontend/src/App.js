import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './App.css';
import AddCard from './Components/AddCard';
import Pay from './Components/Pay';

// Load your Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [view, setView] = useState('addCard'); // 'addCard' or 'pay'

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dempay Demo</h1>
        <nav>
          <button onClick={() => setView('addCard')}>Add Card</button>
          <button onClick={() => setView('pay')}>Pay $5.00</button>
        </nav>
      </header>

      <Elements stripe={stripePromise}>
        {view === 'addCard' ? <AddCard /> : <Pay />}
      </Elements>
    </div>
  );
}

export default App;
