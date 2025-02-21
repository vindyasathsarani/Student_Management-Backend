const Enrollment = require('../models/Enrollment');

const enrollStudent = async (req, res) => {
  try {
    const enrollment = new Enrollment({
      student: req.body.studentId,
      course: req.body.courseId
    });
    await enrollment.save();
    res.status(201).send(enrollment);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'studentId name email')
      .populate('course', 'courseId name');
    res.send(enrollments);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).send({ error: 'Enrollment not found' });
    }
    res.send({ message: 'Enrollment removed successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.student._id })
      .populate('course', 'courseId name credits');
    res.send(enrollments);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'studentId name email')
      .populate('course', 'courseId name');
    if (!enrollment) {
      return res.status(404).send({ error: 'Enrollment not found' });
    }
    res.send(enrollment);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!enrollment) {
      return res.status(404).send({ error: 'Enrollment not found' });
    }
    res.send(enrollment);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = { enrollStudent, getEnrollments, deleteEnrollment, getStudentEnrollments, getEnrollment, updateEnrollment };

// Add other enrollment operations 