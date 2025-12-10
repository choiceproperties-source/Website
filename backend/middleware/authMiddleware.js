import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'choice-properties-dev-secret-2024';

// Admin authentication middleware
export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    // In development, allow requests without token for easier testing
    if (process.env.NODE_ENV !== 'production' && !token) {
      console.log('Dev mode: Allowing request without admin token');
      req.isAdmin = true;
      return next();
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if user has admin role
      if (decoded.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }
      
      req.user = decoded;
      req.isAdmin = true;
      next();
    } catch (jwtError) {
      // In development, allow expired or invalid tokens with warning
      if (process.env.NODE_ENV !== 'production') {
        console.log('Dev mode: Token validation failed, allowing request anyway');
        req.isAdmin = true;
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// User authentication middleware (for regular users)
export const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    // In development, allow requests without token
    if (process.env.NODE_ENV !== 'production' && !token) {
      console.log('Dev mode: Allowing request without user token');
      req.user = { id: 'dev_user', role: 'user' };
      return next();
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in.'
      });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (jwtError) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Dev mode: Token validation failed, allowing request anyway');
        req.user = { id: 'dev_user', role: 'user' };
        return next();
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('User auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Generate admin token (for testing)
export const generateAdminToken = (userId = 'admin_1', email = 'admin@choiceproperties.com') => {
  return jwt.sign(
    { id: userId, email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Generate user token
export const generateUserToken = (userId, email, role = 'user') => {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default adminAuth;
