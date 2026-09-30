const express = require('express');

const controller = require('../controllers/request.controller');

const authenticate = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', controller.findAll);

router.get('/:id', controller.findById);

router.post('/', controller.create);

router.put('/:id', controller.update);

router.delete('/:id', controller.remove);

router.patch('/:id/status', controller.updateStatus);

module.exports = router;
