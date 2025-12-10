import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Trash2, MapPin, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching saved properties from localStorage or API
    setTimeout(() => {
      // Dummy data - in future, fetch from /api/users/:id/saved-properties
      setSavedProperties([
        {
          _id: '1',
          title: 'Luxury Apartment Downtown',
          location: 'New York, NY',
          price: 450000,
          type: 'Apartment',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          _id: '2',
          title: 'Cozy Studio with City View',
          location: 'San Francisco, CA',
          price: 280000,
          type: 'Studio',
          image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleRemove = (id) => {
    setSavedProperties(savedProperties.filter(prop => prop._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
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
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            My Saved Properties
          </h1>
          <p className="text-gray-600 text-lg">
            {savedProperties.length} property {savedProperties.length === 1 ? 'saved' : 'saved'}
          </p>
        </motion.div>

        {/* Saved Properties Grid */}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemove(property._id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Heart className="w-5 h-5 fill-red-600 text-red-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-3">
                    {property.type}
                  </span>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-blue-600" />
                      <p className="text-xl font-bold text-gray-900">
                        {(property.price / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Saved {Math.floor((Date.now() - property.savedAt) / (24 * 60 * 60 * 1000))} days ago
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemove(property._id)}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
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
            <Link
              to="/properties"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Properties
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;
