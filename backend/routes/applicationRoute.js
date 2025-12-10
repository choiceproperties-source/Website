import express from 'express';
import ApplicationModel from '../models/ApplicationModel.js';

const router = express.Router();

// GET /api/applications - Get all applications (admin only)
router.get('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware to check if admin
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
    const { name, email, phone, interested_in, interest_type, budget_min, budget_max, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const application = await ApplicationModel.create({
      name,
      email,
      phone,
      interested_in: interested_in || interest_type,
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
