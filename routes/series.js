const express = require('express');
const router = express.Router();

const seriesController = require('../controllers/seriesController');

// Get list of all seriess
router.get('/', seriesController.series_list);

// Get request to create a series
router.get('/create', seriesController.series_create_get);

// POST request to create a series
router.post('/create', seriesController.series_create_post);

// // Get request to update a series
// router.get('/:series/update', seriesController.series_update_get);

// // POST request to update a series
// router.post('/:series/update', seriesController.series_update_post);

// // Get request to delete a series
// router.get('/:series/delete', seriesController.series_delete_get);

// // POST request to update a series
// router.post('/:series/delete', seriesController.series_delete_post);

module.exports = router;
