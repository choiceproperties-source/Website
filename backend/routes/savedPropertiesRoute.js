import express from 'express';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// In-memory storage for saved properties (replace with database in production)
let savedPropertiesStore = {};

// GET /api/saved-properties - Get saved properties for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id || 'default_user';
    
    // Try to get from store, fallback to dummy data
    let savedProperties = savedPropertiesStore[userId] || [];
    
    if (savedProperties.length === 0) {
      // Return dummy data for development
      savedProperties = [
        {
          _id: '1',
          property_id: 'prop_1',
          title: 'Luxury Apartment Downtown',
          location: 'New York, NY',
          price: 450000,
          type: 'Apartment',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          beds: 3,
          baths: 2,
          savedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '2',
          property_id: 'prop_2',
          title: 'Cozy Studio with City View',
          location: 'San Francisco, CA',
          price: 280000,
          type: 'Studio',
          image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          beds: 1,
          baths: 1,
          savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          property_id: 'prop_3',
          title: 'Modern Townhouse',
          location: 'Los Angeles, CA',
          price: 650000,
          type: 'Townhouse',
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
          beds: 4,
          baths: 3,
          savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
    
    res.json({
      success: true,
      data: savedProperties
    });
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved properties',
      error: error.message
    });
  }
});

// POST /api/saved-properties - Save a property
router.post('/', async (req, res) => {
  try {
    const { user_id, property } = req.body;
    const userId = user_id || 'default_user';
    
    if (!property || !property._id) {
      return res.status(400).json({
        success: false,
        message: 'Property data is required'
      });
    }
    
    // Initialize user's saved properties if not exists
    if (!savedPropertiesStore[userId]) {
      savedPropertiesStore[userId] = [];
    }
    
    // Check if already saved
    const alreadySaved = savedPropertiesStore[userId].some(
      p => p.property_id === property._id || p._id === property._id
    );
    
    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: 'Property already saved'
      });
    }
    
    // Add to saved properties
    const savedProperty = {
      _id: `saved_${Date.now()}`,
      property_id: property._id,
      title: property.title,
      location: property.location,
      price: property.price,
      type: property.type,
      image: property.image?.[0] || property.image,
      beds: property.beds,
      baths: property.baths,
      savedAt: new Date().toISOString()
    };
    
    savedPropertiesStore[userId].push(savedProperty);
    
    res.status(201).json({
      success: true,
      message: 'Property saved successfully',
      data: savedProperty
    });
  } catch (error) {
    console.error('Error saving property:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving property',
      error: error.message
    });
  }
});

// DELETE /api/saved-properties/:id - Remove a saved property
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.user_id || 'default_user';
    
    if (!savedPropertiesStore[userId]) {
      return res.status(404).json({
        success: false,
        message: 'No saved properties found'
      });
    }
    
    const initialLength = savedPropertiesStore[userId].length;
    savedPropertiesStore[userId] = savedPropertiesStore[userId].filter(
      p => p._id !== id && p.property_id !== id
    );
    
    if (savedPropertiesStore[userId].length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Property not found in saved list'
      });
    }
    
    res.json({
      success: true,
      message: 'Property removed from saved list'
    });
  } catch (error) {
    console.error('Error removing saved property:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing saved property',
      error: error.message
    });
  }
});

export default router;
