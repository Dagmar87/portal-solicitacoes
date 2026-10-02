const request = require('supertest');

const {
  app,
  createTestUser,
  createTestRequest,
} = require('./helpers/testHelpers');

describe('Dashboard', () => {
  let user;

  beforeAll(async () => {
    user = await createTestUser();

    await createTestRequest(user.token, {
      title: 'Dashboard - aberto 1',
      category: 'TI',
    });

    await createTestRequest(user.token, {
      title: 'Dashboard - aberto 2',
      category: 'RH',
    });
  });

  test('deve retornar dados do dashboard', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(true);

    expect(response.body.data).toBeDefined();
  });

  test('dashboard deve possuir total', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.data.total).toBeDefined();

    expect(typeof response.body.data.total).toBe('number');
  });

  test('dashboard deve possuir quantidade de abertas', async () => {
    const response = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);

    expect(response.body.data.abertas).toBeDefined();

    expect(typeof response.body.data.abertas).toBe('number');
  });

  test('não deve acessar dashboard sem autenticação', async () => {
    const response = await request(app).get('/api/dashboard');

    expect(response.statusCode).toBe(401);

    expect(response.body.success).toBe(false);
  });
});
