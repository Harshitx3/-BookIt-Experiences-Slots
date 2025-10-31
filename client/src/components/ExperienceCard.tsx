import { Link } from 'react-router-dom';

interface ExperienceCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
  category: string;
}

const ExperienceCard = ({ id, title, image, price, description, location, category }: ExperienceCardProps) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <span className="absolute top-3 right-3 bg-white text-xs font-medium px-2 py-1 rounded-full">
          {category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">{location}</p>
        <p className="mt-2 text-xs text-gray-600">{description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">From</span>
            <p className="font-semibold">₹{price}</p>
          </div>
          <Link 
            to={`/experience/${id}`}
            className="text-xs bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;