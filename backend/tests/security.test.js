const request = require('supertest');

const { app } = require('./helpers/testHelpers');

describe('Segurança', () => {
  test('deve rejeitar token JWT inválido', async () => {
    const response = await request(app)
      .get('/api/requests')
      .set(
        'Authorization',
        'Bearer token-invalido'
      );

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });

  test('deve rejeitar Authorization sem Bearer', async () => {
    const response = await request(app)
      .get('/api/requests')
      .set(
        'Authorization',
        'token-invalido'
      );

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });

  test('deve rejeitar Authorization vazio', async () => {
    const response = await request(app)
      .get('/api/requests')
      .set(
        'Authorization',
        ''
      );

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });
});