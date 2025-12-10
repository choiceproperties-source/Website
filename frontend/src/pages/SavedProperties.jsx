import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Trash2, MapPin, IndianRupee, Loader, BedDouble, Bath } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Backendurl } from '../App';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedProperties();
  }, []);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Backendurl}/api/saved-properties`);
      const data = response.data?.data || response.data || [];
      setSavedProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      toast.error('Failed to load saved properties');
      // Fallback to empty array
      setSavedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await axios.delete(`${Backendurl}/api/saved-properties/${id}`);
      setSavedProperties(savedProperties.filter(prop => prop._id !== id && prop.property_id !== id));
      toast.success('Property removed from saved list');
    } catch (error) {
      console.error('Error removing property:', error);
      toast.error('Failed to remove property');
    } finally {
      setRemovingId(null);
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/properties/single/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My Saved Properties
          </h1>
          <p className="text-gray-600 text-lg">
            {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </motion.div>

        {/* Saved Properties Grid */}
        <AnimatePresence mode="popLayout">
          {savedProperties.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {savedProperties.map((property, index) => (
                <motion.div
                  key={property._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div 
                    className="relative h-48 sm:h-64 overflow-hidden cursor-pointer"
                    onClick={() => handleViewProperty(property.property_id || property._id)}
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(property._id);
                      }}
                      disabled={removingId === property._id}
                      className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    >
                      {removingId === property._id ? (
                        <Loader className="w-5 h-5 text-red-600 animate-spin" />
                      ) : (
                        <Heart className="w-5 h-5 fill-red-600 text-red-600" />
                      )}
                    </button>
                    
                    {/* Property Type Badge */}
                    <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {property.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h3 
                      className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => handleViewProperty(property.property_id || property._id)}
                    >
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{property.location}</span>
                    </div>

                    {/* Property Features */}
                    {(property.beds || property.baths) && (
                      <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                        {property.beds && (
                          <div className="flex items-center gap-1">
                            <BedDouble className="w-4 h-4" />
                            <span>{property.beds} beds</span>
                          </div>
                        )}
                        {property.baths && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{property.baths} baths</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-blue-600" />
                        <p className="text-xl font-bold text-gray-900">
                          {(property.price / 100000).toFixed(1)}L
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Saved {property.savedAt ? Math.floor((Date.now() - new Date(property.savedAt)) / (24 * 60 * 60 * 1000)) : 0} days ago
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(property._id)}
                      disabled={removingId === property._id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      {removingId === property._id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Remove from Saved
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-6">No saved properties yet</p>
              <p className="text-gray-500 mb-8">
                Browse properties and click the heart icon to save your favorites
              </p>
              <Link
                to="/properties"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Browse Properties
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SavedProperties;
