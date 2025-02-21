const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');
const Enrollment = require('../models/Enrollment');

describe('Enrollment Controller', () => {
  let adminToken, studentToken, enrollmentId;

  before(async () => {
    // Get admin token
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'NewAdmin123!' });
    adminToken = adminRes.body.token;

    // Get student token
    const studentRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'S1001@university.edu', password: 'Student123' });
    studentToken = studentRes.body.token;
  });

  it('should enroll a student', async () => {
    const res = await request(app)
      .post('/api/enrollments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        studentId: 'S1001',
        courseId: 'MATH101'
      });
    
    expect(res.status).to.equal(201);
    enrollmentId = res.body._id;
  });

  it('should update enrollment status', async () => {
    const res = await request(app)
      .put(`/api/enrollments/${enrollmentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'completed' });
    
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('completed');
  });

  it('should get student enrollments', async () => {
    const res = await request(app)
      .get('/api/enrollments/my-enrollments')
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });
}); 