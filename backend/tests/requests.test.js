const request = require('supertest');

const {
  app,
  createTestUser,
  createTestRequest,
} = require('./helpers/testHelpers');

describe('Solicitações', () => {
  let user;
  let requestId;

  beforeAll(async () => {
    user = await createTestUser();
  });

  describe('POST /api/requests', () => {
    test('deve criar uma solicitação autenticada', async () => {
      const response = await createTestRequest(user.token);

      expect(response.statusCode).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toBeDefined();

      expect(response.body.data.id).toBeDefined();

      expect(response.body.data.title).toBe('Solicitação de teste');

      expect(response.body.data.category).toBe('TI');

      expect(response.body.data.status).toBe('ABERTO');

      requestId = response.body.data.id;
    });

    test('não deve criar solicitação sem autenticação', async () => {
      const response = await request(app).post('/api/requests').send({
        title: 'Solicitação sem autenticação',
        description: 'Teste',
        category: 'TI',
      });

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);
    });

    test('não deve criar solicitação sem título', async () => {
      const response = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          description: 'Descrição',
          category: 'TI',
        });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });

    test('não deve aceitar categoria inválida', async () => {
      const response = await request(app)
        .post('/api/requests')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Teste categoria',
          description: 'Descrição',
          category: 'CATEGORIA_INVALIDA',
        });

      expect(response.statusCode).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/requests', () => {
    test('deve listar solicitações autenticadas', async () => {
      const response = await request(app)
        .get('/api/requests')
        .set('Authorization', `Bearer ${user.token}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('não deve listar solicitações sem autenticação', async () => {
      const response = await request(app).get('/api/requests');

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/requests/:id', () => {
    test('deve buscar uma solicitação existente', async () => {
      const response = await request(app)
        .get(`/api/requests/${requestId}`)
        .set('Authorization', `Bearer ${user.token}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.id).toBe(requestId);
    });

    test('deve retornar 404 para solicitação inexistente', async () => {
      const response = await request(app)
        .get('/api/requests/99999999')
        .set('Authorization', `Bearer ${user.token}`);

      expect(response.statusCode).toBe(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/requests/:id', () => {
    test('deve editar solicitação que está ABERTA', async () => {
      const response = await request(app)
        .put(`/api/requests/${requestId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Solicitação atualizada',
          description: 'Descrição atualizada',
          category: 'RH',
        });

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.title).toBe('Solicitação atualizada');

      expect(response.body.data.category).toBe('RH');
    });
  });

  describe('PATCH /api/requests/:id/status', () => {
    test('deve alterar status para EM_ATENDIMENTO', async () => {
      const response = await request(app)
        .patch(`/api/requests/${requestId}/status`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          status: 'EM_ATENDIMENTO',
        });

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.status).toBe('EM_ATENDIMENTO');
    });

    test('deve alterar status para CONCLUIDO', async () => {
      const response = await request(app)
        .patch(`/api/requests/${requestId}/status`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          status: 'CONCLUIDO',
        });

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.status).toBe('CONCLUIDO');
    });
  });

  describe('PUT /api/requests/:id após conclusão', () => {
    test('não deve permitir editar solicitação concluída', async () => {
      const response = await request(app)
        .put(`/api/requests/${requestId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Tentativa de alteração',
          description: 'Não deveria permitir',
          category: 'TI',
        });

      expect([400, 403]).toContain(response.statusCode);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Controle de propriedade', () => {
    let secondUser;
    let secondRequestId;

    beforeAll(async () => {
      secondUser = await createTestUser();

      const response = await createTestRequest(secondUser.token, {
        title: 'Solicitação do segundo usuário',
        category: 'FINANCEIRO',
      });

      secondRequestId = response.body.data.id;
    });

    test('não deve permitir editar solicitação de outro usuário', async () => {
      const response = await request(app)
        .put(`/api/requests/${secondRequestId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Alteração indevida',
          description: 'Teste de segurança',
          category: 'TI',
        });

      expect([403, 404]).toContain(response.statusCode);

      expect(response.body.success).toBe(false);
    });

    test('não deve permitir excluir solicitação de outro usuário', async () => {
      const response = await request(app)
        .delete(`/api/requests/${secondRequestId}`)
        .set('Authorization', `Bearer ${user.token}`);

      expect([403, 404]).toContain(response.statusCode);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/requests/:id', () => {
    test('deve excluir uma solicitação aberta', async () => {
      const createResponse = await createTestRequest(user.token, {
        title: 'Solicitação para exclusão',
      });

      const id = createResponse.body.data.id;

      const deleteResponse = await request(app)
        .delete(`/api/requests/${id}`)
        .set('Authorization', `Bearer ${user.token}`);

      expect(deleteResponse.statusCode).toBe(200);

      expect(deleteResponse.body.success).toBe(true);
    });

    test('não deve excluir solicitação inexistente', async () => {
      const response = await request(app)
        .delete('/api/requests/99999999')
        .set('Authorization', `Bearer ${user.token}`);

      expect(response.statusCode).toBe(404);

      expect(response.body.success).toBe(false);
    });

    test('não deve excluir sem autenticação', async () => {
      const response = await request(app).delete('/api/requests/1');

      expect(response.statusCode).toBe(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Filtros de solicitações', () => {
    beforeAll(async () => {
      await createTestRequest(user.token, {
        title: 'Computador com problema',
        description: 'Problema no computador',
        category: 'TI',
      });

      await createTestRequest(user.token, {
        title: 'Solicitação de férias',
        description: 'Solicitação de férias',
        category: 'RH',
      });

      await createTestRequest(user.token, {
        title: 'Compra de material',
        description: 'Material para escritório',
        category: 'COMPRAS',
      });
    });

    test('deve filtrar por categoria', async () => {
      const response = await request(app)
        .get('/api/requests')
        .query({
          category: 'TI',
        })
        .set('Authorization', `Bearer ${user.token}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.data.every((item) => item.category === 'TI')).toBe(
        true,
      );
    });

    test('deve filtrar por status', async () => {
      const response = await request(app)
        .get('/api/requests')
        .query({
          status: 'ABERTO',
        })
        .set('Authorization', `Bearer ${user.token}`);

      expect(response.statusCode).toBe(200);

      expect(response.body.data.every((item) => item.status === 'ABERTO')).toBe(
        true,
      );
    });

    test('deve filtrar por título', async () => {
      const response = await request(app)
        .get('/api/requests')
        .query({
          title: 'Computador',
        })
        .set('Authorization', `Bearer ${user.token}`);

      expect(response.statusCode).toBe(200);

      expect(
        response.body.data.some((item) => item.title.includes('Computador')),
      ).toBe(true);
    });
  });
});
