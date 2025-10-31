import { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { getExperienceById, validatePromoCode, createBooking } from '../services/api';

interface Experience {
  id: string;
  title: string;
  price: number;
}

const Checkout = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date') || '';
  const time = queryParams.get('time') || '';
  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    promoCode: '',
    agreeToTerms: false
  });
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    // Mock data - would be replaced with API call
    const mockExperience = {
      id: '1',
      title: 'Kayaking',
      price: 899
    };
    
    setExperience(mockExperience);
    setLoading(false);
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleApplyPromo = async () => {
    if (!formData.promoCode) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    try {
      const response = await validatePromoCode(formData.promoCode);
      if (response.valid) {
        setDiscount(response.discount);
        setPromoApplied(true);
        setPromoError('');
      } else {
        setDiscount(0);
        setPromoApplied(false);
        setPromoError('Invalid promo code');
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setPromoError('Failed to validate promo code');
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.agreeToTerms) {
      return;
    }
    
    // Create booking data
    const bookingData = {
      experienceId: id,
      experienceTitle: experience?.title,
      date,
      time,
      fullName: formData.fullName,
      email: formData.email,
      promoCode: promoApplied ? formData.promoCode : null,
      totalAmount: total
    };
    
    // Simple redirect to confirmation page
    navigate('/confirmation', { 
      state: { 
        bookingReference: 'REF-' + Math.floor(100000 + Math.random() * 900000),
        experienceTitle: bookingData.experienceTitle,
        date: bookingData.date,
        time: bookingData.time
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Experience not found</p>
      </div>
    );
  }

  const subtotal = experience.price;
  const taxes = 99;
  const total = subtotal + taxes - discount;

  return (
    <div className="w-full px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Pathway" className="h-10" />
        </div>
      </header>

      <div className="mb-4">
        <Link to={`/experience/${id}`} className="text-gray-600 flex items-center">
          <span className="mr-2">←</span> Checkout
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Your Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 mb-2">Full name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="promoCode" className="block text-gray-700 mb-2">Promo code</label>
              <div className="flex">
                <input
                  type="text"
                  id="promoCode"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-r-md hover:bg-yellow-600 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-red-500 text-sm mt-1">{promoError}</p>}
              {promoApplied && <p className="text-green-500 text-sm mt-1">Promo code applied!</p>}
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mr-2"
                  required
                />
                <span className="text-gray-700 text-sm">I agree to the terms and safety policy</span>
              </label>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Experience Summary</h2>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Date</span>
              <span className="font-semibold">{date}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Time</span>
              <span className="font-semibold">{time}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Qty</span>
              <span className="font-semibold">1</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between mb-4">
              <span className="text-gray-700">Taxes</span>
              <span className="font-semibold">₹{taxes}</span>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="text-gray-900 font-bold">₹{total}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Pay and Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;