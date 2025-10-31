import { useState, useEffect, useMemo } from 'react';
import { getExperiences } from '../services/api';
import ExperienceCard from '../components/ExperienceCard';
import { useSearch } from '../context/SearchContext';

interface Experience {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
  category: string;
}

const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { searchQuery } = useSearch();

  const filteredExperiences = useMemo(() => {
    return experiences.filter(experience => 
      experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [experiences, searchQuery]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch experiences:', err);
        setLoading(false);
        
        // Fallback to mock data if API fails
        const mockExperiences = [
          {
            id: '1',
            title: 'Kayaking',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
            price: 999,
            description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
            location: 'Udupi, Karnataka',
            category: 'Water'
          },
          {
            id: '2',
            title: 'Nandi Hills Sunrise',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
            price: 899,
            description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
            location: 'Bangalore',
            category: 'Mountain'
          },
          {
            id: '3',
            title: 'Coffee Trail',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
            price: 1299,
            description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
            location: 'Coorg',
            category: 'Nature'
          },
          {
            id: '4',
            title: 'Kayaking',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
            price: 999,
            description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
            location: 'Udupi, Karnataka',
            category: 'Water'
          },
          {
            id: '5',
            title: 'Boat Cruise',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
            price: 999,
            description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
            location: 'Gokarna',
            category: 'Water'
          },
          {
            id: '6',
            title: 'Bunjee Jumping',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
            price: 999,
            description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
            location: 'Mysore',
            category: 'Adventure'
          },
          {
            id: '7',
            title: 'Coffee Trail',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
            price: 1299,
            description: 'Guided small-group experience. Certified guide. Safety first with gear included.',
            location: 'Coorg',
            category: 'Nature'
          }
        ];
        
        setExperiences(mockExperiences);
      }
    };
    
    fetchExperiences();
  }, []);

  // Filtering is now handled by the useMemo above

  return (
    <div className="h-full bg-gray-50">
      <div className="w-full px-4 py-6">
        {loading && <p className="text-center text-gray-600">Loading experiences...</p>}
        
        {/* Experience grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchQuery && filteredExperiences.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No experiences found matching "{searchQuery}"</p>
            </div>
          ) : filteredExperiences.map(experience => (
            <ExperienceCard
              key={experience.id}
              id={experience.id}
              title={experience.title}
              image={experience.image}
              price={experience.price}
              description={experience.description}
              location={experience.location}
              category={experience.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;