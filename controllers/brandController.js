const Brand = require('../models/brand');
const Guitar = require('../models/guitar');

const { body, validationResult } = require('express-validator');

// Display list of all Brands
exports.brand_list = function (req, res, next) {
  Brand.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_brands) {
      if (err) {
        return next(err);
      }
      res.render('brand_list', {
        title: 'Brands',
        brand_list: list_brands,
      });
    });
};
