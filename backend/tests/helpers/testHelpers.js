const request = require('supertest');

const app = require('../../src/app');

async function createTestUser() {
  const username = `user_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 8)}`;

  const password = '123456';

  const registerResponse = await request(app).post('/api/auth/register').send({
    username,
    password,
  });

  if (![200, 201].includes(registerResponse.statusCode)) {
    throw new Error(
      `Não foi possível criar usuário de teste: ${JSON.stringify(
        registerResponse.body,
      )}`,
    );
  }

  const loginResponse = await request(app).post('/api/auth/login').send({
    username,
    password,
  });

  if (loginResponse.statusCode !== 200) {
    throw new Error(
      `Não foi possível realizar login: ${JSON.stringify(loginResponse.body)}`,
    );
  }

  return {
    username,
    password,
    token: loginResponse.body.data.token,
  };
}

async function createTestRequest(token, data = {}) {
  const defaultData = {
    title: 'Solicitação de teste',
    description: 'Descrição da solicitação de teste automatizado.',
    category: 'TI',
  };

  const response = await request(app)
    .post('/api/requests')
    .set('Authorization', `Bearer ${token}`)
    .send({
      ...defaultData,
      ...data,
    });

  return response;
}

module.exports = {
  app,
  createTestUser,
  createTestRequest,
};
