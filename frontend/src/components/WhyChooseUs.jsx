import { motion } from 'framer-motion';
import { Globe, Gift, Zap, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: Globe,
    title: "Nationwide Coverage",
    description: "Access properties across the entire nation with our extensive network of real estate professionals"
  },
  {
    icon: Gift,
    title: "Free Property Listing",
    description: "List your property for free with no hidden charges. Our agents will help market it to thousands of buyers"
  },
  {
    icon: Zap,
    title: "Fast Response Times",
    description: "Get quick responses from our team. We prioritize your inquiries and provide timely updates on all transactions"
  },
  {
    icon: ShieldCheck,
    title: "Professional Agents",
    description: "Work with certified, experienced agents who have a proven track record of successful transactions"
  }
];

const BenefitCard = ({ benefit, index }) => {
  const Icon = benefit.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      {/* Card */}
      <div className="p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-blue-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {benefit.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {benefit.description}
        </p>

        {/* Accent Line */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-b-xl"></div>
      </div>
    </motion.div>
  );
};

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
            Why Choose Choice Properties?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're committed to providing the best real estate experience with reliability, speed, and expertise
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-6 mt-20 text-center"
        >
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">25K+</div>
            <p className="text-gray-600">Properties Listed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">4.9/5</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
