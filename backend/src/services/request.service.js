const repository = require('../repositories/request.repository');

async function create(data, userId) {
  return repository.create({
    ...data,
    userId,
  });
}

async function findAll(filters) {
  return repository.findAll(filters);
}

async function findById(id) {
  const request = await repository.findById(id);

  if (!request) {
    const error = new Error('Solicitação não encontrada');

    error.statusCode = 404;

    throw error;
  }

  return request;
}

async function update(id, data, userId) {
  const request = await repository.findById(id);

  if (!request) {
    const error = new Error('Solicitação não encontrada');

    error.statusCode = 404;

    throw error;
  }

  if (request.user_id !== userId) {
    const error = new Error('Você não pode editar esta solicitação');

    error.statusCode = 403;

    throw error;
  }

  if (request.status !== 'ABERTO') {
    const error = new Error('Somente solicitações abertas podem ser editadas');

    error.statusCode = 400;

    throw error;
  }

  return repository.update(id, data);
}

async function remove(id, userId) {
  const request = await repository.findById(id);

  if (!request) {
    const error = new Error('Solicitação não encontrada');

    error.statusCode = 404;

    throw error;
  }

  if (request.user_id !== userId) {
    const error = new Error('Você não pode excluir esta solicitação');

    error.statusCode = 403;

    throw error;
  }

  if (request.status !== 'ABERTO') {
    const error = new Error('Somente solicitações abertas podem ser excluídas');

    error.statusCode = 400;

    throw error;
  }

  await repository.remove(id);
}

async function updateStatus(id, status) {
  const request = await repository.findById(id);

  if (!request) {
    const error = new Error('Solicitação não encontrada');

    error.statusCode = 404;

    throw error;
  }

  return repository.updateStatus(id, status);
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  updateStatus,
};
