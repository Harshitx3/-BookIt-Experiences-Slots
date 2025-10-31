import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getExperienceById } from '../services/api';

interface Experience {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  longDescription: string;
  availableDates?: string[];
  availableTimes?: { [date: string]: string[] };
}

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperienceDetails = async () => {
      if (!id) return;
      
      try {
        const data = await getExperienceById(id);
        setExperience(data);
        
        // If there are available dates, select the first one by default
        if (data.availableDates && data.availableDates.length > 0) {
          setSelectedDate(data.availableDates[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch experience details:', err);
        setError('Failed to load experience details. Please try again later.');
        setLoading(false);
        
        // Fallback to mock data if API fails
        const mockExperience = {
          id: '1',
          title: 'Kayaking',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
          price: 899,
          description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
          longDescription: 'Guided small-group experience. Certified guide. Safety first with gear included. Helmet and life jacket. All skill levels welcome in kayaking.'
        };
        
        setExperience(mockExperience);
      }
    };
    
    fetchExperienceDetails();
  }, [id]);

  const dates = ['Oct 22', 'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26'];
  const times = ['09:00 am', '11:00 am', '01:00 pm'];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime && experience) {
      window.location.href = `/checkout/${experience.id}?date=${selectedDate}&time=${selectedTime}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <p className="text-center text-gray-600 text-lg">Loading experience details...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {experience && (
        <>
          <div className="mb-8">
            <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
              &larr; Back to Experiences
            </Link>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={experience.image} 
                alt={experience.title} 
                className="w-full h-64 object-cover"
              />
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-3xl font-bold">{experience.title}</h1>
                  <p className="text-primary text-2xl font-bold">₹{experience.price}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-2">About this experience</h2>
                  <p className="text-gray-700">{experience.longDescription || experience.description}</p>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Choose date</h2>
                  <div className="flex flex-wrap gap-2">
                    {dates.map((date) => (
                      <button
                        key={date}
                        onClick={() => handleDateSelect(date)}
                        className={`px-4 py-2 rounded-full border ${
                          selectedDate === date
                            ? 'bg-yellow-500 text-white border-yellow-500'
                            : 'border-gray-300 hover:border-yellow-500'
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Choose time</h2>
                  <div className="flex flex-wrap gap-2">
                    {times.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`px-4 py-2 rounded-full border ${
                          selectedTime === time
                            ? 'bg-yellow-500 text-white border-yellow-500'
                            : 'border-gray-300 hover:border-yellow-500'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Starts at</span>
              <span className="font-semibold">₹{experience.price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Qty</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold">₹{experience.price}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-700">Taxes</span>
              <span className="font-semibold">₹99</span>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="text-gray-900 font-bold">₹{experience.price + 99}</span>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                selectedDate && selectedTime
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Details;