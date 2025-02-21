const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');
const Student = require('../models/Student');

describe('Student Controller', () => {
  let adminToken, studentId;

  before(async () => {
    // Login as admin
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'NewAdmin123!' });
    adminToken = res.body.token;
  });

  it('should create a new student', async () => {
    const res = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        studentId: 'S1002',
        name: 'New Student',
        dateOfBirth: '2001-05-15',
        major: 'Mathematics'
      });
    
    expect(res.status).to.equal(201);
    studentId = res.body._id;
  });

  it('should get all students', async () => {
    const res = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('should prevent deletion with active enrollments', async () => {
    // Assume student has enrollments
    const res = await request(app)
      .delete(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('Cannot delete student');
  });
}); 