const request = require('supertest');

const app = require('../src/app');

describe('Autenticação', () => {
  const username = `dagmar2026_${Date.now()}`;
  const password = '123456';

  describe('POST /api/auth/register', () => {
    test('deve cadastrar um novo usuário', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username,
        password,
      });

      expect(response.statusCode).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();

      expect(response.body.data.username).toBe(username);
    });

    test('não deve permitir usuário duplicado', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username,
        password,
      });

      expect([400, 409]).toContain(response.statusCode);

      expect(response.body.success).toBe(false);
    });

    test('deve rejeitar cadastro sem username', async () => {
      const response = await request(app).post('/api/auth/register').send({
        password,
      });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test('deve rejeitar cadastro sem senha', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: `dagmar2026_${Date.now()}`,
        });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    test('deve realizar login com credenciais válidas', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username,
        password,
      });

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();

      expect(response.body.data.token).toBeDefined();

      expect(typeof response.body.data.token).toBe('string');
    });

    test('deve rejeitar senha incorreta', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username,
        password: 'senha_errada',
      });

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);
    });
  });
});
