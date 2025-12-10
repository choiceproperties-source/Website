import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, FileText, DollarSign, Home, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Backendurl } from '../App';
import { toast } from 'react-toastify';

const Apply = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interested_in: 'buy',
    property_type: 'apartment',
    budget_min: '',
    budget_max: '',
    message: '',
    agent_preference: '' // For sellers/buyers who want specific agents
  });

  const [validationErrors, setValidationErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate phone
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^[0-9\-\+\(\)\s]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Validate interested_in
    if (!formData.interested_in) {
      errors.interested_in = 'Please select an option';
    }

    // Budget validation for buyers
    if (formData.interested_in === 'buy' && formData.budget_min && formData.budget_max) {
      if (parseInt(formData.budget_min) > parseInt(formData.budget_max)) {
        errors.budget = 'Minimum budget cannot exceed maximum budget';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Submit to backend with all fields
      const response = await axios.post(`${Backendurl}/api/applications`, formData);
      
      if (response.data.success) {
        setSubmitted(true);
        toast.success('Application submitted successfully!');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            interested_in: 'buy',
            property_type: 'apartment',
            budget_min: '',
            budget_max: '',
            message: '',
            agent_preference: ''
          });
          setValidationErrors({});
          setSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your application has been submitted successfully. Our team will contact you within 24 hours.
          </p>
          <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-4">
            Apply Today
          </h1>
          <p className="text-gray-600 text-lg">
            Tell us about your real estate goals and we'll help you find the perfect property
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="(555) 123-4567"
              />
              {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
            </div>

            {/* Interested In */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I'm interested in *</label>
              <select
                name="interested_in"
                value={formData.interested_in}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="buy">Buying</option>
                <option value="rent">Renting</option>
                <option value="sell">Selling</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type *</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
                <option value="studio">Studio</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Budget Min */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range (Min)</label>
              <input
                type="number"
                name="budget_min"
                value={formData.budget_min}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="50000"
              />
            </div>

            {/* Budget Max */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range (Max)</label>
              <input
                type="number"
                name="budget_max"
                value={formData.budget_max}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="500000"
              />
              {validationErrors.budget && <p className="text-red-500 text-sm mt-1">{validationErrors.budget}</p>}
            </div>

            {/* Conditional: Agent Preference for sellers/buyers */}
            {(formData.interested_in === 'sell' || formData.interested_in === 'buy') && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Agent (Optional)</label>
                <select
                  name="agent_preference"
                  value={formData.agent_preference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="">No preference</option>
                  <option value="any">Any available agent</option>
                  <option value="specialists">Real estate specialists</option>
                </select>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Tell us more about your real estate goals..."
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <p className="text-center text-gray-600 text-sm mt-4">
            * Required fields
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Apply;
