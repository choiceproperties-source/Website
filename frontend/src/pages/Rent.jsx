import { motion } from 'framer-motion';
import { CheckCircle, FileText, DollarSign, Users, MapPin, Calendar, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Rent = () => {
  const navigate = useNavigate();

  const requirements = [
    {
      icon: FileText,
      title: "Valid ID",
      description: "Government-issued identification for verification"
    },
    {
      icon: DollarSign,
      title: "Income Proof",
      description: "Recent pay stubs or income documentation (typically 3x rent)"
    },
    {
      icon: Users,
      title: "References",
      description: "Previous landlord or character references"
    },
    {
      icon: Shield,
      title: "Credit Check",
      description: "Authorization for background and credit verification"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Browse Properties",
      description: "Explore our extensive collection of rental properties"
    },
    {
      number: "02",
      title: "Submit Application",
      description: "Fill out the rental application form with your details"
    },
    {
      number: "03",
      title: "Verification",
      description: "We verify your income, credit, and references"
    },
    {
      number: "04",
      title: "Approval & Lease",
      description: "Get approved and sign your rental agreement"
    },
    {
      number: "05",
      title: "Move In",
      description: "Complete final checks and move into your new home"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Start Your Rental Journey</h1>
          <p className="text-xl text-blue-100 mb-8">
            Find your perfect rental property with Choice Properties. Simple process, transparent requirements.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Rental Process Explanation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">How the Rental Process Works</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 md:p-12 mb-12">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Renting a property through Choice Properties is straightforward and transparent. We guide you through every step of the process, from browsing available properties to signing your lease agreement. Our experienced agents ensure that all requirements are clearly communicated and the process moves smoothly.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We believe in fair rental practices and work to match you with properties that fit your lifestyle and budget. Whether you're looking for a cozy studio or a spacious family home, we have options for everyone.
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white border-2 border-blue-200 rounded-lg p-6 text-center h-full hover:border-blue-600 transition-colors">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{step.number}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Requirements Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Rental Requirements</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            To rent a property through Choice Properties, you'll need to provide the following information for verification:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {requirements.map((req, index) => {
              const Icon = req.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-bold text-gray-800 mb-2">{req.title}</h3>
                  <p className="text-gray-600 text-sm">{req.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Rental Home?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Browse our available rental properties and submit your application today. Our team is here to help you find the perfect place.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/apply')}
            className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Apply to Rent
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
};

export default Rent;
