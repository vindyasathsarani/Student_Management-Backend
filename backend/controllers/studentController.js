const Student = require('../models/Student');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    
    // Create user account
    const user = new User({
      email: `${student.studentId}@university.edu`,
      password: 'Student123',
      role: 'student',
      student: student._id
    });
    await user.save();

    res.status(201).send(student);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-__v');
    const studentsWithEmail = students.map(student => ({
      ...student.toObject(),
      email: `${student.studentId}@university.edu`
    }));
    res.send(studentsWithEmail);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-__v');
    if (!student) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.send({
      ...student.toObject(),
      email: `${student.studentId}@university.edu`
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.send(student);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const enrollments = await Enrollment.findOne({ student: req.params.id });
    if (enrollments) {
      return res.status(400).send({ error: 'Cannot delete student with existing enrollments' });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send({ error: 'Student not found' });
    }
    
    await User.findOneAndDelete({ student: student._id });
    res.send({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student)
      .select('-__v')
      .lean();
    
    const enrollments = await Enrollment.find({ student: req.student })
      .populate('course', 'courseId name credits');
    
    res.send({
      ...student,
      enrollments
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = { 
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile
}; 