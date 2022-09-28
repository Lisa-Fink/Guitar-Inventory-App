const express = require('express');
const router = express.Router();

const guitarInstanceController = require('../controllers/guitarInstanceController');

// Get list of all guitars
router.get('/', guitarInstanceController.guitar_list);

// Get request to create a guitar
router.get('/create', guitarInstanceController.guitar_create_get);

// POST request to create a guitar
router.post('/create', guitarInstanceController.guitar_create_post);

// Get request to update a guitar
router.get('/:id/update', guitarInstanceController.guitar_update_get);

// POST request to update a guitar
router.post('/:id/update', guitarInstanceController.guitar_update_post);

// // Get request to delete a guitar
// router.get('/:guitar/delete', guitarInstanceController.guitar_delete_get);

// // POST request to update a guitar
// router.post('/:guitar/delete', guitarInstanceController.guitar_delete_post);

module.exports = router;
