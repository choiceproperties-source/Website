import express from 'express';
import ApplicationModel from '../models/ApplicationModel.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/applications - Get all applications (admin only)
// Middleware placeholder: adminAuth validates JWT token (implementation pending)
router.get('/', adminAuth, async (req, res) => {
  try {
    const applications = await ApplicationModel.getAll();
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
