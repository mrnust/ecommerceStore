import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import "./PaymentForm.css"
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');

  const fetchClientSecret = async () => {
    // Fetch the client secret from your server
    const response = await axios.get('http://localhost:3001/create-payment-intent', {
      params: { amount: 1599 }, // Pass any amount you want
    });
    console.log('Axios Response:', response);
    setClientSecret(response.data.clientSecret);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    fetchClientSecret();  
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error('Payment failed:', error.message);
    } else if (paymentIntent) {
      console.log('Payment succeeded:', paymentIntent);
    }
  };
  const cardElementStyle = {
    base: {
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    },
  };
  return (
    <form onSubmit={handlePayment} className="payment-form">
      <CardElement className="card-element" options={{ style: cardElementStyle }}/>
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default PaymentForm;
