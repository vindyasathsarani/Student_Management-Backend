const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
