import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetails from './components/properties/propertydetail';
import Aboutus from './pages/About'
import Contact from './pages/Contact'
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Footer from './components/Footer';
import NotFoundPage from './components/Notfound';
import { AuthProvider } from './context/AuthContext';
import AIPropertyHub from './pages/Aiagent'
import StructuredData from './components/SEO/StructuredData';
import Apply from './pages/Apply'
import Rent from './pages/Rent'
import Buy from './pages/Buy'
import Sell from './pages/Sell'
import Agents from './pages/Agents'
import AgentDetail from './pages/AgentDetail'
import ListProperty from './pages/ListProperty'
import Dashboard from './pages/Dashboard'
import SavedProperties from './pages/SavedProperties'
import AdminPanel from './pages/AdminPanel'
import 'react-toastify/dist/ReactToastify.css';


export const Backendurl = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  return (
    <HelmetProvider>
    <AuthProvider>
    <Router>
      {/* Base website structured data */}
      <StructuredData type="website" />
      <StructuredData type="organization" />
      
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/single/:id" element={<PropertyDetails />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ai-property-hub" element={<AIPropertyHub />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/list-property" element={<ListProperty />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/saved-properties" element={<SavedProperties />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
    </AuthProvider>
    </HelmetProvider>
  )
}

export default App