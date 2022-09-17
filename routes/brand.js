var express = require('express');
var router = express.Router();

const brandController = require('../controllers/brandController');

// Get list of all brands
router.get('/', brandController.brand_list);

// // Get request to delete brand
// router.get('/brands/:id/delete', brandController.brand_delete_get);

// // Get request for creating a brand
// router.get('/brands/create', brandController.brand_create_get);

// // POST request for creating a brand
// router.post('/brands/create', brandController.brand_create_post);

// // POST request to delete a brand
// router.get('/brands/:id/delete', brandController.brand_delete_post);

// // Get request to update a brand
// router.get('/brands/:id/update', brandController.brand_update_get);

// // Post request to update a brand
// router.post('/brands/:id/update', brandController.brand_update_post);

// // Get request for one brand
// router.get('/:id', brandController.brand_detail);

module.exports = router;
