import express from 'express';
import PropertyListingModel from '../models/PropertyListing.js';

const router = express.Router();

// GET /api/properties - Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await PropertyListingModel.getAll();
    res.json({
      success: true,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
});

// GET /api/properties/:id - Get single property
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await PropertyListingModel.getById(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
});

// POST /api/properties - Create property
router.post('/', async (req, res) => {
  try {
    const { title, address, city, state, zip, price, beds, baths, sqft, description, amenities, contact_phone, contact_email, images } = req.body;

    if (!title || !address || !city || !state || !zip || !price || !beds || !baths || !sqft) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const property = await PropertyListingModel.create({
      title,
      address,
      city,
      state,
      zip,
      price: parseInt(price),
      beds: parseInt(beds),
      baths: parseFloat(baths),
      sqft: parseInt(sqft),
      description,
      amenities,
      images,
      contact_phone,
      contact_email
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
});

// PUT /api/properties/:id - Update property
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const property = await PropertyListingModel.update(id, updateData);

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
});

// DELETE /api/properties/:id - Delete property
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await PropertyListingModel.remove(id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
});

export default router;
