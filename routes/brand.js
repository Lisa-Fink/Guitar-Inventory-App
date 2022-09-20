var express = require('express');
var router = express.Router();

const brandController = require('../controllers/brandController');

// Get list of all brands
router.get('/', brandController.brand_list);

// Get request to delete brand
router.get('/:name/delete', brandController.brand_delete_get);

// Get request for creating a brand
router.get('/create', brandController.brand_create_get);

// POST request for creating a brand
router.post('/create', brandController.brand_create_post);

// // POST request to delete a brand
// router.get('/:name/delete', brandController.brand_delete_post);

// Get request to update a brand
router.get('/:name/update', brandController.brand_update_get);

// Post request to update a brand
router.post('/:name/update', brandController.brand_update_post);

// Get request for one brand
router.get('/:name', brandController.brand_detail);

// Get request for one brand->model
router.get('/:brand/:model', brandController.brand_model_detail);

// Get request for one brand->model->series
router.get('/:brand/:model/:series', brandController.brand_model_series_detail);

// Get request for instance brand->model->series -> instance
router.get(
  '/:brand/:model/:series/:serial',
  brandController.brand_model_series_instance_detail
);

module.exports = router;
