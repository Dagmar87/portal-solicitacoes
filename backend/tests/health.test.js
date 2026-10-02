require('dotenv').config();

const request = require('supertest');

const app = require('../src/app');

describe('Health Check', () => {
  test('deve retornar API funcionando', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);
  });
});
