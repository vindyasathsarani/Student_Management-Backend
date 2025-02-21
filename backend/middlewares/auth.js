const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Admin access required' });
    }
    next();
  });
};

const studentAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'student') {
      return res.status(403).send({ error: 'Student access required' });
    }
    req.student = req.user.student;
    next();
  });
};

module.exports = { 
  auth, 
  adminAuth, 
  studentAuth 
}; 