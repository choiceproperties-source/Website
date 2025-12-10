import express from 'express';
import ContactFormModel from '../models/ContactFormModel.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const contactForm = await ContactFormModel.create({
      name,
      email,
      phone,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contactForm
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
});

export default router;
