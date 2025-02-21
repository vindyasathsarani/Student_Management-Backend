const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    const response = {
      user: {
        email: user.email,
        role: user.role
      },
      token
    };

    if (user.role === 'student') {
      const student = await Student.findById(user.student);
      response.student = student;
    }

    res.send(response);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = req.body.newPassword;
    await user.save();
    res.send({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = { login, changePassword, getUsers }; 