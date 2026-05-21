import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nv_vogue_super_secret_jwt_key_987654_production_grade');
      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      next();
    } catch (error) {
      console.error(`[Auth Middleware Error]: ${error.message}`);
      res.status(401);
      res.json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401);
    res.json({ message: 'Not authorized, no token found' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    res.json({ message: 'Access denied, administrator role required' });
  }
};
