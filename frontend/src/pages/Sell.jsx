import { motion } from 'framer-motion';
import { CheckCircle, FileText, Home, TrendingUp, Users, DollarSign, ArrowRight, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sell = () => {
  const navigate = useNavigate();

  const whySellWithUs = [
    {
      icon: Users,
      title: "Experienced Agents",
      description: "Our expert agents have sold thousands of properties and know the market inside out"
    },
    {
      icon: TrendingUp,
      title: "Maximum Exposure",
      description: "Your property gets featured on multiple platforms to reach the widest audience"
    },
    {
      icon: DollarSign,
      title: "Best Price",
      description: "We help you price your property competitively to maximize your profit"
    },
    {
      icon: Shield,
      title: "Secure Transaction",
      description: "All transactions are handled professionally with complete transparency"
    }
  ];

  const requiredDocuments = [
    "Proof of Ownership (Deed, Title, or Ownership Certificate)",
    "Recent Property Tax Assessment",
    "HOA Documents (if applicable)",
    "Home Inspection Reports (if available)",
    "Utility Bills and Statements",
    "List of Major Repairs/Renovations",
    "Home Warranty Information (if applicable)",
    "Survey or Property Boundaries Documentation"
  ];

  const sellingSteps = [
    {
      number: "01",
      title: "Free Home Evaluation",
      description: "We assess your property and provide a competitive market analysis"
    },
    {
      number: "02",
      title: "List Your Property",
      description: "Your property is listed on all major platforms with professional photos"
    },
    {
      number: "03",
      title: "Market Your Home",
      description: "We use targeted marketing to attract qualified buyers"
    },
    {
      number: "04",
      title: "Show Your Property",
      description: "Qualified buyers view your property and submit offers"
    },
    {
      number: "05",
      title: "Negotiate Offers",
      description: "We negotiate on your behalf to get the best deal"
    },
    {
      number: "06",
      title: "Close the Sale",
      description: "Complete inspections, appraisals, and finalize the sale"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Ready to Sell Your Property?</h1>
          <p className="text-xl text-purple-100 mb-8">
            Get maximum value for your home. List with Choice Properties and sell with confidence.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Why Sell With Us */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">Why List Your Property With Us?</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            We provide comprehensive services to ensure your property sells quickly and for the best price
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whySellWithUs.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200 hover:shadow-lg transition-shadow"
                >
                  <Icon className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="font-bold text-gray-800 mb-2 text-lg">{reason.title}</h3>
                  <p className="text-gray-600 text-sm">{reason.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Selling Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Step-by-Step Selling Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white border-2 border-purple-200 rounded-lg p-8 h-full hover:border-purple-600 hover:shadow-lg transition-all">
                  <div className="text-3xl font-bold text-purple-600 mb-3">{step.number}</div>
                  <h3 className="font-bold text-gray-800 text-lg mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Required Documents */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Documents You'll Need</h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Gather these documents to prepare your property for listing
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {requiredDocuments.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 bg-white p-6 rounded-lg border-l-4 border-purple-500"
              >
                <FileText className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{doc}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Competitive Commission Rates</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            We offer transparent, competitive commission rates with no hidden fees. Get a free consultation to learn about our pricing.
          </p>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to List Your Property?</h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Get started with a free property evaluation. Our agents will help you through the entire selling process.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/list-property')}
            className="bg-white text-purple-600 font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            List Your Property
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
};

export default Sell;
