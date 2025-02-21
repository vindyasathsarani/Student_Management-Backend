const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
});

StudentSchema.virtual("email").get(function () {
  return `${this.studentId}@university.edu`;
});

StudentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Student", StudentSchema);
