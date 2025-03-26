const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Bug = require('../models/Bug');

// Mock MongoDB connection
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/bug-tracker-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Bug API Tests', () => {
  let bugId;

  beforeEach(async () => {
    await Bug.deleteMany({});
  });

  it('should create a new bug', async () => {
    const response = await request(app)
      .post('/api/bugs')
      .send({
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'open',
        priority: 'medium',
        createdBy: 'Test User'
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Bug');
    bugId = response.body._id;
  });

  it('should get all bugs', async () => {
    const response = await request(app)
      .get('/api/bugs')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update a bug', async () => {
    const response = await request(app)
      .put(`/api/bugs/${bugId}`)
      .send({
        status: 'in-progress',
        priority: 'high'
      })
      .expect(200);

    expect(response.body.status).toBe('in-progress');
    expect(response.body.priority).toBe('high');
  });

  it('should delete a bug', async () => {
    const response = await request(app)
      .delete(`/api/bugs/${bugId}`)
      .expect(200);

    expect(response.body.message).toBe('Bug removed');
  });

  it('should handle validation errors', async () => {
    const response = await request(app)
      .post('/api/bugs')
      .send({
        title: 'x', // too short
        description: 'short', // too short
        status: 'invalid', // invalid status
        priority: 'invalid' // invalid priority
      })
      .expect(400);

    expect(response.body.errors).toBeDefined();
  });
});
