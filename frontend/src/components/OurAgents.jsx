import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Twitter, MapPin, Award, Users } from 'lucide-react';

const agents = [
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
    properties: 45
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
    properties: 62
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
    properties: 38
  }
];

const AgentCard = ({ agent, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
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
            <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-lg mb-1">
              <Users className="w-4 h-4" />
              {agent.properties}
            </div>
            <p className="text-xs text-gray-600">Properties</p>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 font-semibold mb-2">Specialties:</p>
          <div className="flex flex-wrap gap-2">
            {agent.specialties.map((specialty, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
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

        {/* Social */}
        <div className="flex gap-3 mt-4 pt-4 border-t justify-center">
          <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const OurAgents = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
            Meet Our Expert Agents
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our team of experienced professionals is dedicated to helping you find your dream property
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurAgents;
