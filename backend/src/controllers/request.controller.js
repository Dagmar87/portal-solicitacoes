const service = require('../services/request.service');

const {
  createRequestSchema,
  updateRequestSchema,
  statusSchema,
} = require('../validators/request.validator');

async function create(req, res, next) {
  try {
    const data = createRequestSchema.parse(req.body);

    const request = await service.create(data, req.user.id);

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

async function findAll(req, res, next) {
  try {
    const requests = await service.findAll(req.query);

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
}

async function findById(req, res, next) {
  try {
    const request = await service.findById(Number(req.params.id));

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = updateRequestSchema.parse(req.body);

    const request = await service.update(
      Number(req.params.id),
      data,
      req.user.id,
    );

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await service.remove(Number(req.params.id), req.user.id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = statusSchema.parse(req.body);

    const request = await service.updateStatus(Number(req.params.id), status);

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
  updateStatus,
};
