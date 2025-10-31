import { Link, useLocation } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const { bookingReference, experienceTitle, date, time } = location.state || {};
  
  return (
    <div className="w-full px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Pathway" className="h-10" />
        </div>
        <div>
          <button className="bg-yellow-500 text-white px-4 py-1 rounded-md">
            Search
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Booking Confirmed</h1>
        <div className="bg-green-100 text-green-800 py-1 px-3 rounded-md inline-block mb-6">
          <p>REF-{bookingReference || 'UNKNOWN'}</p>
        </div>
        
        <Link 
          to="/"
          className="block w-full py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;