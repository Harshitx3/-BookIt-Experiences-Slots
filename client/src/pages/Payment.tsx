import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../services/api';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const [processing, setProcessing] = useState(true);
  
  useEffect(() => {
    // Simulate payment processing
    const processPayment = async () => {
      try {
        // Wait 2 seconds to simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Submit booking to API
        const response = await createBooking(bookingData);
        
        // Navigate to confirmation page with booking reference
        navigate('/confirmation', { 
          state: { 
            bookingReference: response.bookingReference,
            experienceTitle: bookingData.experienceTitle,
            date: bookingData.date,
            time: bookingData.time
          } 
        });
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('Payment failed. Please try again.');
        navigate(-1); // Go back to checkout page
      }
    };

    if (bookingData) {
      processPayment();
    } else {
      // If no booking data, redirect back to home
      navigate('/');
    }
  }, [bookingData, navigate]);

  return (
    <div className="w-full px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Pathway" className="h-10" />
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-solid mx-auto mb-6"></div>
        
        <h1 className="text-2xl font-bold mb-4">Processing Payment</h1>
        <p className="text-gray-600 mb-6">Please wait while we process your payment...</p>
      </div>
    </div>
  );
};

export default Payment;