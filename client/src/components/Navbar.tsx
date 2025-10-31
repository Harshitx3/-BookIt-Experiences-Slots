import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results page with query parameter
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`, { replace: true });
  };

  return (
    <div className="w-full">
      {/* Top navbar with search */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/highway-delite-logo.svg" 
              alt="Highway Delite" 
              className="h-10 w-auto"
            />
          </Link>
        </div>
        
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search experiences"
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-0 top-0 h-full bg-yellow-400 text-black px-4 rounded-r-md">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navbar;