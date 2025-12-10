import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, IndianRupee, BedDouble, Bath, Maximize, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Backendurl } from '../App';

const sampleProperties = [
  {
    _id: "f1",
    title: "Luxury Beachfront Villa",
    location: "Miami, Florida",
    price: 2500000,
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "Villa",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    _id: "f2",
    title: "Modern Downtown Apartment",
    location: "New York, NY",
    price: 1850000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "Apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    _id: "f3",
    title: "Riverside Townhouse",
    location: "Austin, Texas",
    price: 1200000,
    beds: 3,
    baths: 2,
    sqft: 2200,
    type: "House",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    _id: "f4",
    title: "Cozy Mountain Cabin",
    location: "Denver, Colorado",
    price: 950000,
    beds: 2,
    baths: 2,
    sqft: 1400,
    type: "Cabin",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    _id: "f5",
    title: "Suburban Family Home",
    location: "Portland, Oregon",
    price: 650000,
    beds: 4,
    baths: 2.5,
    sqft: 2400,
    type: "House",
    image: "https://images.unsplash.com/photo-1570129477492-45c003537e1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    _id: "f6",
    title: "Downtown Studio Loft",
    location: "Los Angeles, CA",
    price: 750000,
    beds: 1,
    baths: 1,
    sqft: 800,
    type: "Loft",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const PropertyCard = ({ property, index }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/properties/single/${property._id}`);
  };

  const imageUrl = property.image || property.image?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={handleNavigate}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {property.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-600 mb-3 text-sm">
          <MapPin className="w-4 h-4 text-red-500" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <IndianRupee className="w-4 h-4 text-green-600" />
          <span className="text-2xl font-bold text-green-600">
            ${(property.price / 1000000).toFixed(1)}M
          </span>
        </div>

        {/* Features */}
        <div className="flex justify-between text-gray-600 text-sm border-t pt-3">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4" />
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.baths} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedProperties = () => {
  const [properties, setProperties] = useState(sampleProperties);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${Backendurl}/api/products`);
        if (response.data && response.data.length > 0) {
          setProperties(response.data.slice(0, 6));
        }
      } catch (error) {
        console.log('Using sample properties');
        setProperties(sampleProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
            Featured Properties
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our hand-picked selection of premium properties across the nation
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <PropertyCard key={property._id} property={property} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <a href="/properties"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            View All Properties
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
