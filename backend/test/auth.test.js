const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Student = require('../models/Student');

describe('Auth Controller', () => {
  let adminToken, studentToken;
  
  before(async () => {
    // Create test admin
    const admin = new User({
      email: 'admin@test.com',
      password: 'Admin123!',
      role: 'admin'
    });
    await admin.save();

    // Create test student
    const student = await Student.create({
      studentId: 'S1001',
      name: 'Test Student',
      dateOfBirth: '2000-01-01',
      major: 'Computer Science'
    });
    const studentUser = new User({
      email: 'S1001@university.edu',
      password: 'Student123',
      role: 'student',
      student: student._id
    });
    await studentUser.save();
  });

  it('should login admin user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'Admin123!' });
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
    adminToken = res.body.token;
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrong' });
    
    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('Invalid credentials');
  });

  it('should change password', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newPassword: 'NewAdmin123!' });
    
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Password changed successfully');
  });

  it('should get all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/auth/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
}); 