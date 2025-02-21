require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const connectDB = require('../config/db');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear all existing data
    await Promise.all([
      User.deleteMany(),
      Student.deleteMany(),
      Course.deleteMany(),
      Enrollment.deleteMany()
    ]);

    // Create Admin User
    const adminUser = await User.create({
      email: 'admin@university.edu',
      password: 'Admin123!',
      role: 'admin'
    });

    // Create sample students
    const students = [
      {
        studentId: 'S1001',
        name: 'John Doe',
        dateOfBirth: new Date('2000-01-15'),
        major: 'Computer Science'
      },
      {
        studentId: 'S1002',
        name: 'Jane Smith',
        dateOfBirth: new Date('1999-05-22'),
        major: 'Electrical Engineering'
      }
    ];

    // Create student records and user accounts
    const studentRecords = await Student.insertMany(students);
    await Promise.all(studentRecords.map(async (student) => {
      await User.create({
        email: `${student.studentId}@university.edu`,
        password: 'Student123',
        role: 'student',
        student: student._id
      });
    }));

    // Create sample courses
    const courses = [
      {
        courseId: 'CSC101',
        name: 'Introduction to Programming',
        credits: 3,
        startDate: new Date('2024-09-01')
      },
      {
        courseId: 'EE201',
        name: 'Circuit Analysis',
        credits: 4,
        startDate: new Date('2024-09-01')
      }
    ];

    const courseRecords = await Course.insertMany(courses);

    // Create enrollments
    await Enrollment.insertMany([
      {
        student: studentRecords[0]._id,
        course: courseRecords[0]._id
      },
      {
        student: studentRecords[1]._id,
        course: courseRecords[1]._id
      }
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase(); 