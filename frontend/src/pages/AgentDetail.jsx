import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Award, MapPin, Star, ArrowLeft, Calendar } from 'lucide-react';
import axios from 'axios';
import { Backendurl } from '../App';

const sampleAgentDetail = {
  id: 1,
  name: "Sarah Johnson",
  title: "Senior Real Estate Agent",
  location: "California",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  email: "sarah@choiceproperties.com",
  phone: "(555) 123-4567",
  specialties: ["Residential", "Luxury Homes", "Property Management"],
  yearsExperience: 12,
  properties: 45,
  rating: 4.9,
  reviews: 142,
  bio: "With over 12 years of experience in residential real estate, Sarah has built a reputation for her dedication to finding the perfect home for her clients. Her expertise spans luxury homes, investment properties, and first-time buyer assistance.",
  services: [
    "Home buying assistance",
    "Seller representation",
    "Property valuation",
    "Market analysis",
    "Negotiation support",
    "Closing coordination"
  ],
  recentSales: [
    { title: "Modern Downtown Penthouse", price: "$2.5M", date: "Nov 2024" },
    { title: "Beachfront Villa", price: "$1.8M", date: "Oct 2024" },
    { title: "Suburban Family Home", price: "$850K", date: "Sep 2024" }
  ]
};

const AgentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(sampleAgentDetail);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`${Backendurl}/api/agents/${id}`);
        setAgent(response.data || sampleAgentDetail);
      } catch (error) {
        console.log('Using sample agent detail');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate('/agents')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Agents
        </motion.button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-1"
          >
            <img
              src={agent.image}
              alt={agent.name}
              className="w-full rounded-xl shadow-2xl object-cover h-96"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{agent.name}</h1>
            <p className="text-xl text-blue-100 mb-6">{agent.title}</p>

            {/* Location */}
            <div className="flex items-center gap-2 mb-6 text-blue-100">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{agent.location}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                ))}
              </div>
              <span className="text-lg font-semibold">{agent.rating} ({agent.reviews} reviews)</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold">{agent.yearsExperience}+</div>
                <p className="text-blue-100">Years Experience</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-3xl font-bold">{agent.properties}</div>
                <p className="text-blue-100">Properties Sold</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex gap-4">
              <a href={`mailto:${agent.email}`}
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
              <a href={`tel:${agent.phone}`}
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Bio */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{agent.bio}</p>
        </motion.section>

        {/* Specialties */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Specialties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agent.specialties.map((specialty, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6"
              >
                <h3 className="font-semibold text-gray-800 text-lg">{specialty}</h3>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agent.services.map((service, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-bold">✓</span>
                </div>
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Recent Sales */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Recent Sales</h2>
          <div className="space-y-4">
            {agent.recentSales.map((sale, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{sale.title}</h3>
                    <p className="text-green-600 font-semibold text-2xl">{sale.price}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{sale.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Work Together?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Contact {agent.name.split(' ')[0]} today to discuss your real estate needs.
          </p>
          <a href={`mailto:${agent.email}`}
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Get in Touch
          </a>
        </motion.section>
      </div>
    </div>
  );
};

export default AgentDetail;
