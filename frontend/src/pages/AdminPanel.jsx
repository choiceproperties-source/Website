import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Backendurl } from '../App';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    agents: 0
  });
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/applications`);
        const data = Array.isArray(response.data) 
          ? response.data 
          : response.data?.data || [];
        
        setApplications(data.slice(0, 5));
        setStats({
          totalApplications: data.length,
          pendingApplications: data.filter(a => a.status === 'pending').length,
          approvedApplications: data.filter(a => a.status === 'approved').length,
          agents: 12 // Dummy data
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        // Use dummy data
        setStats({
          totalApplications: 24,
          pendingApplications: 8,
          approvedApplications: 14,
          agents: 12
        });
        setApplications([
          { _id: '1', name: 'John Doe', interested_in: 'buy', status: 'pending' },
          { _id: '2', name: 'Jane Smith', interested_in: 'rent', status: 'approved' },
          { _id: '3', name: 'Mike Johnson', interested_in: 'sell', status: 'pending' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Overview of applications and platform metrics
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl shadow-md p-6 border-l-4 border-${stat.color}-600`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className={`text-4xl font-bold text-${stat.color}-600 mt-2`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 bg-${stat.color}-200 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
          </div>

          {applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Interest</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{app.name}</td>
                      <td className="px-6 py-4 capitalize text-gray-600">{app.interested_in}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          app.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                          Review
                        </button>
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

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
        >
          <p className="text-blue-900 font-semibold">
            🚀 More admin features coming soon: Agent management, detailed analytics, and user management.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
