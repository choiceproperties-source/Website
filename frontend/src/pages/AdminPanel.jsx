import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Users, FileText, AlertCircle, TrendingUp, 
  Plus, Trash2, X, Loader, Building, CheckCircle, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Backendurl } from '../App';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    agents: 0,
    properties: 0
  });
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [addingAgent, setAddingAgent] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');
  
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    phone: '',
    about: '',
    specialties: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch applications and agents in parallel
      const [appsResponse, agentsResponse] = await Promise.all([
        axios.get(`${Backendurl}/api/applications`).catch(() => ({ data: { data: [] } })),
        axios.get(`${Backendurl}/api/agents`).catch(() => ({ data: { data: [] } }))
      ]);
      
      const appsData = Array.isArray(appsResponse.data) 
        ? appsResponse.data 
        : appsResponse.data?.data || [];
      
      const agentsData = Array.isArray(agentsResponse.data)
        ? agentsResponse.data
        : agentsResponse.data?.data || [];
      
      setApplications(appsData.slice(0, 10));
      setAgents(agentsData);
      
      setStats({
        totalApplications: appsData.length,
        pendingApplications: appsData.filter(a => a.status === 'pending').length,
        approvedApplications: appsData.filter(a => a.status === 'approved').length,
        agents: agentsData.length,
        properties: 0
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    
    if (!newAgent.name || !newAgent.email || !newAgent.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setAddingAgent(true);
      const response = await axios.post(`${Backendurl}/api/agents`, {
        ...newAgent,
        specialties: newAgent.specialties.split(',').map(s => s.trim()).filter(Boolean)
      });
      
      if (response.data.success) {
        toast.success('Agent created successfully');
        setAgents([...agents, response.data.data]);
        setStats(prev => ({ ...prev, agents: prev.agents + 1 }));
        setNewAgent({ name: '', email: '', phone: '', about: '', specialties: '' });
        setShowAddAgent(false);
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error(error.response?.data?.message || 'Failed to create agent');
    } finally {
      setAddingAgent(false);
    }
  };

  const handleDeleteAgent = async (id) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    
    try {
      setDeletingId(id);
      await axios.delete(`${Backendurl}/api/agents/${id}`);
      setAgents(agents.filter(a => a._id !== id && a.id !== id));
      setStats(prev => ({ ...prev, agents: prev.agents - 1 }));
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateApplicationStatus = async (id, newStatus) => {
    try {
      // Update locally for now (backend implementation pending)
      setApplications(applications.map(app => 
        (app._id === id || app.id === id) ? { ...app, status: newStatus } : app
      ));
      
      // Update stats
      const updatedApps = applications.map(app => 
        (app._id === id || app.id === id) ? { ...app, status: newStatus } : app
      );
      setStats(prev => ({
        ...prev,
        pendingApplications: updatedApps.filter(a => a.status === 'pending').length,
        approvedApplications: updatedApps.filter(a => a.status === 'approved').length
      }));
      
      toast.success(`Application ${newStatus}`);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Manage applications, agents, and properties
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'blue' },
            { label: 'Pending', value: stats.pendingApplications, icon: AlertCircle, color: 'yellow' },
            { label: 'Approved', value: stats.approvedApplications, icon: TrendingUp, color: 'green' },
            { label: 'Agents', value: stats.agents, icon: Users, color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl shadow-md p-4 md:p-6 border-l-4 border-blue-600 hover:shadow-lg transition-shadow"
              style={{ borderLeftColor: stat.color === 'blue' ? '#2563eb' : stat.color === 'yellow' ? '#ca8a04' : stat.color === 'green' ? '#16a34a' : '#9333ea' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl md:text-4xl font-bold text-gray-900 mt-1 md:mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="p-2 md:p-3 bg-gray-100 rounded-lg">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {['applications', 'agents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Applications Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-4 md:p-6 border-b bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              </div>

              {applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">Interest</th>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, index) => (
                        <motion.tr
                          key={app._id || app.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 md:px-6 py-4 font-medium text-gray-900">{app.name}</td>
                          <td className="px-4 md:px-6 py-4 capitalize text-gray-600 hidden sm:table-cell">{app.interested_in}</td>
                          <td className="px-4 md:px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                              app.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleUpdateApplicationStatus(app._id || app.id, 'approved')}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleUpdateApplicationStatus(app._id || app.id, 'rejected')}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-600">
                  No applications yet
                </div>
              )}
            </motion.div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Add Agent Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowAddAgent(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Agent
                </button>
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent._id || agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAgent(agent._id || agent.id)}
                        disabled={deletingId === (agent._id || agent.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {deletingId === (agent._id || agent.id) ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{agent.phone}</p>
                    {agent.specialties && (
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(agent.specialties) ? agent.specialties : agent.specialties.split(',')).slice(0, 3).map((spec, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {spec.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {agents.length === 0 && (
                <div className="text-center py-12 text-gray-600">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No agents yet. Add your first agent!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Agent Modal */}
        <AnimatePresence>
          {showAddAgent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddAgent(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Add New Agent</h3>
                  <button
                    onClick={() => setShowAddAgent(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddAgent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                    <input
                      type="text"
                      value={newAgent.specialties}
                      onChange={(e) => setNewAgent({ ...newAgent, specialties: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Residential, Commercial, Luxury"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                    <textarea
                      value={newAgent.about}
                      onChange={(e) => setNewAgent({ ...newAgent, about: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      rows="3"
                      placeholder="Brief bio..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddAgent(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addingAgent}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {addingAgent ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add Agent'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;
