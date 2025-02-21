const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');
const Course = require('../models/Course');

describe('Course Controller', () => {
  let adminToken, courseId;

  before(async () => {
    // Login as admin
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'NewAdmin123!' });
    adminToken = res.body.token;
  });

  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        courseId: 'MATH101',
        name: 'Calculus I',
        credits: 4,
        startDate: '2024-09-01'
      });
    
    expect(res.status).to.equal(201);
    courseId = res.body._id;
  });

  it('should prevent course deletion with enrollments', async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.status).to.equal(400);
    expect(res.body.error).to.include('Cannot delete course');
  });
}); 