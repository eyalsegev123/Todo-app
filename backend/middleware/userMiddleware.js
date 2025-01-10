const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header received:', authHeader); // Debug log

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Invalid header format received:', authHeader);
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted (without Bearer):', token); // Debug log

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token payload:', decoded); // Debug log

      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired',
          isExpired: true
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
