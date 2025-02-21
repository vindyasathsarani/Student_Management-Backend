const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'email name')
      .select('-__v');
    res.send(courses);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send(course);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const enrollments = await Enrollment.findOne({ course: req.params.id });
    if (enrollments) {
      return res.status(400).send({ error: 'Cannot delete course with existing enrollments' });
    }
    
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .select('-__v');
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send(course);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Add other CRUD operations
module.exports = { createCourse, getCourses, updateCourse, deleteCourse, getCourse }; 