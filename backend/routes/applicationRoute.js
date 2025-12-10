import express from 'express';
import ApplicationModel from '../models/ApplicationModel.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/applications - Get all applications (admin only)
// Middleware placeholder: adminAuth validates JWT token (implementation pending)
router.get('/', adminAuth, async (req, res) => {
  try {
    // Try to fetch from database, fallback to dummy data
    let applications = [];
    try {
      applications = await ApplicationModel.getAll();
    } catch (dbError) {
      console.log('Using dummy data for applications');
      // Return dummy applications for frontend development
      applications = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          interested_in: 'buy',
          property_type: 'apartment',
          budget_min: 200000,
          budget_max: 500000,
          message: 'Looking for a cozy apartment in downtown',
          status: 'pending',
          property_name: 'Modern Downtown Apartment',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '(555) 234-5678',
          interested_in: 'rent',
          property_type: 'villa',
          message: 'Interested in renting a luxury villa',
          status: 'approved',
          property_name: 'Beachfront Villa',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '(555) 345-6789',
          interested_in: 'sell',
          property_type: 'house',
          message: 'Want to sell my family home',
          status: 'pending',
          property_name: 'Suburban Family Home',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '4',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          phone: '(555) 456-7890',
          interested_in: 'buy',
          property_type: 'townhouse',
          budget_min: 300000,
          budget_max: 600000,
          message: 'First-time homebuyer',
          status: 'approved',
          property_name: 'Modern Townhouse',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
    
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message
    });
  }
});

// POST /api/applications - Submit application
router.post('/', async (req, res) => {
  try {
    // Validate all required fields
    const { name, email, phone, interested_in, property_type, budget_min, budget_max, message } = req.body;

    if (!name || !email || !phone || !interested_in) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, phone, and interested_in are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone format'
      });
    }

    const application = await ApplicationModel.create({
      name,
      email,
      phone,
      interested_in,
      property_type,
      budget_min,
      budget_max,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message
    });
  }
});

export default router;
