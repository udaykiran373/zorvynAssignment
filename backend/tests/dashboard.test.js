const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Dashboard Summary API', () => {
  beforeAll(async () => {
    // Avoid connecting cleanly here if running without memory server to not touch prod data
    // In real scenarios, use process.env.MONGO_URI = memoryServerUri
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should deny access if no token is provided', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.statusCode).toEqual(401);
  });
});
