import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/properties');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// POST /api/properties - Submit property listing
router.post('/', upload.any(), async (req, res) => {
  try {
    const {
      title,
      address,
      city,
      state,
      zip,
      price,
      beds,
      baths,
      sqft,
      description,
      amenities,
      phone,
      email
    } = req.body;

    // Validation
    if (!title || !address || !city || !state || !zip || !price || !beds || !baths || !sqft || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // TODO: Handle file uploads to ImageKit or cloud storage
    // const thumbnailUrl = req.files?.find(f => f.fieldname === 'thumbnail')?.path;
    // const galleryUrls = req.files?.filter(f => f.fieldname.startsWith('gallery_')).map(f => f.path);

    // TODO: Insert into Supabase properties_submissions table
    // const { data, error } = await supabase
    //   .from('properties_submissions')
    //   .insert([{
    //     title, address, city, state, zip, price,
    //     beds, baths, sqft, description, amenities,
    //     phone, email, status: 'pending'
    //   }]);

    res.json({
      success: true,
      message: 'Property listed successfully. Pending admin approval.',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error listing property',
      error: error.message
    });
  }
});

export default router;
