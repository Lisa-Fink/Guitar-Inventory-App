const express = require('express');
const router = express.Router();

const modelController = require('../controllers/modelController');

// Get list of all models
router.get('/', modelController.model_list);

// Get request to create a model
router.get('/create', modelController.model_create_get);

// POST request to create a model
router.post('/create', modelController.model_create_post);

// Get request to update a model
router.get('/:model/:id/update', modelController.model_update_get);

// POST request to update a model
router.post('/:model/:id/update', modelController.model_update_post);

// Get request to delete a model
router.get('/:model/:id/delete', modelController.model_delete_get);

// POST request to update a model
router.post('/:model/:id/delete', modelController.model_delete_post);

module.exports = router;
