import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Award, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Backendurl } from '../App';

const sampleAgents = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Real Estate Agent",
    location: "California",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    email: "sarah@choiceproperties.com",
    phone: "(555) 123-4567",
    specialties: ["Residential", "Luxury Homes"],
    yearsExperience: 12,
    properties: 45,
    bio: "With over 12 years of experience in residential real estate, Sarah has built a reputation for her dedication to finding the perfect home for her clients."
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Commercial Properties Specialist",
    location: "New York",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    email: "michael@choiceproperties.com",
    phone: "(555) 234-5678",
    specialties: ["Commercial", "Industrial"],
    yearsExperience: 15,
    properties: 62,
    bio: "Michael specializes in commercial real estate with a proven track record of successful transactions in urban markets."
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    title: "Investment Properties Expert",
    location: "Texas",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    email: "emma@choiceproperties.com",
    phone: "(555) 345-6789",
    specialties: ["Investment", "Multi-family"],
    yearsExperience: 10,
    properties: 38,
    bio: "Emma helps investors find high-potential properties and maximize their real estate portfolios."
  }
];

const AgentCard = ({ agent, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{agent.name}</h3>
        <p className="text-blue-600 font-semibold text-sm mb-3">{agent.title}</p>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>{agent.location}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-4 text-center">
          <div className="flex-1">
            <div className="flex items-center justify-center gap-1 text-blue-600 font-bold text-lg mb-1">
              <Award className="w-4 h-4" />
              {agent.yearsExperience}
            </div>
            <p className="text-xs text-gray-600">Years Exp.</p>
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg text-green-600 mb-1">{agent.properties}</div>
            <p className="text-xs text-gray-600">Properties</p>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4 flex flex-wrap gap-2">
          {agent.specialties.map((specialty, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Contact */}
        <div className="border-t pt-4 space-y-2">
          <a href={`mailto:${agent.email}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="truncate">{agent.email}</span>
          </a>
          <a href={`tel:${agent.phone}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{agent.phone}</span>
          </a>
        </div>

        {/* View Details Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const Agents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState(sampleAgents);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${Backendurl}/api/agents`);
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        if (data && data.length > 0) {
          setAgents(data);
        }
      } catch (error) {
        console.log('Using sample agents');
      }
    };

    fetchAgents();
  }, []);

  const handleAgentClick = (agentId) => {
    navigate(`/agents/${agentId}`);
  };

  // Get unique specialties from all agents
  const allSpecialties = ['All', ...new Set(agents.flatMap(agent => agent.specialties || []))];

  // Filter agents by selected specialty
  const filteredAgents = selectedSpecialty === 'All' 
    ? agents 
    : agents.filter(agent => 
        agent.specialties && agent.specialties.includes(selectedSpecialty)
      );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Expert Agents</h1>
          <p className="text-xl text-blue-100">
            Meet our team of experienced real estate professionals dedicated to helping you achieve your property goals
          </p>
        </motion.div>
      </div>

      {/* Specialty Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter by Specialty</h2>
          <div className="flex flex-wrap gap-3">
            {allSpecialties.map((specialty) => (
              <motion.button
                key={specialty}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedSpecialty === specialty
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {specialty}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onClick={() => handleAgentClick(agent.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No agents found for this specialty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agents;
