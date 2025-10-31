import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

const Search = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearch();
  
  // Get query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const queryFromUrl = queryParams.get('query') || '';
  
  useEffect(() => {
    // Update search context with URL query
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
    
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperiences();
  }, [queryFromUrl, searchQuery, setSearchQuery]);
  
  // Filter experiences based on search query
  const filteredExperiences = experiences.filter(experience => {
    const query = searchQuery.toLowerCase();
    return (
      experience.title.toLowerCase().includes(query) ||
      experience.description.toLowerCase().includes(query) ||
      experience.location.toLowerCase().includes(query) ||
      experience.category.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {searchQuery ? `Search results for "${searchQuery}"` : 'All Experiences'}
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading experiences...</p>
        </div>
      ) : filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredExperiences.map(experience => (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No experiences found matching "{searchQuery}"</p>
          <p className="text-gray-400 mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default Search;