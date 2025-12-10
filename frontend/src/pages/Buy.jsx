import { motion } from 'framer-motion';
import { CheckCircle, CreditCard, Home, Search, FileText, Shield, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Buy = () => {
  const navigate = useNavigate();

  const buyingProcess = [
    {
      icon: Search,
      title: "Search Properties",
      description: "Browse our extensive listing of homes for sale"
    },
    {
      icon: Home,
      title: "Schedule Tour",
      description: "View properties in person with our agents"
    },
    {
      icon: CreditCard,
      title: "Get Pre-Approved",
      description: "Determine your buying power with a lender"
    },
    {
      icon: FileText,
      title: "Make an Offer",
      description: "Submit your offer with our expert guidance"
    },
    {
      icon: Shield,
      title: "Inspections & Appraisal",
      description: "Complete required inspections and appraisals"
    },
    {
      icon: TrendingUp,
      title: "Close the Deal",
      description: "Finalize your purchase and get the keys"
    }
  ];

  const preApprovalChecklist = [
    "Get pre-approved for a mortgage",
    "Know your credit score and history",
    "Gather financial documentation",
    "Determine your budget and down payment",
    "Get pre-approval letter from lender",
    "Research neighborhoods and market trends",
    "Connect with a real estate agent (us!)",
    "Get homeowners insurance quote"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Start Your Home Buying Journey</h1>
          <p className="text-xl text-green-100 mb-8">
            Find your dream home with expert guidance. We make buying a home simple, transparent, and stress-free.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Buying Process */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">The Buying Process</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Here's a step-by-step overview of what to expect when buying a home with Choice Properties
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyingProcess.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-10 h-10 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2 text-lg">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Pre-Approval Checklist */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">Pre-Approval Checklist</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Before you start looking at homes, make sure you've completed these important steps
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {preApprovalChecklist.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 bg-white p-6 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-shadow"
              >
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Buy With Us */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Buy With Choice Properties?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">25K+</div>
              <p className="text-gray-600">Properties Available</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">Expert</div>
              <p className="text-gray-600">Guidance Throughout</p>
            </div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Buy Your Dream Home?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Contact our agents or fill out our application form to get started on your buying journey today.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/apply')}
            className="bg-white text-green-600 font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            Apply & Get Started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
};

export default Buy;
