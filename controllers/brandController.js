const Brand = require('../models/brand');
const Guitar = require('../models/guitar');
const Guitarinstance = require('../models/guitarinstance');
const Series = require('../models/series');

const async = require('async');

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

// Display list of all guitars/models of the brand
exports.brand_detail = async function (req, res, next) {
  const brandInfo = await Brand.find({ name: req.params.name });
  const guitarInfo = await Guitar.find({ brand: req.params.name });

  const allGuitars = await Guitarinstance.find({ brand: req.params.name });

  if (brandInfo == null) {
    // No results.
    const err = new Error('Brand not found');
    err.status = 404;
    return next(err);
  }
  // Successful
  res.render('brand_detail', {
    title: req.params.name + ' Guitars',
    guitarModels: guitarInfo,
    guitarInstance: allGuitars,
  });
};

// Display list of all series/guitars of the model
exports.brand_model_detail = function (req, res, next) {
  const getInfo = async () => {
    try {
      const brand = await Brand.findOne({ name: req.params.brand });
      const guitarModel = await Guitar.find({
        model: req.params.model,
      }).count();
      const guitarSeries = await Series.find({ model: req.params.model });
      const guitars = await Guitarinstance.find({ model: req.params.model });

      if (!brand | !guitarModel | !guitarSeries.length) {
        const err = new Error('Not found');
        err.status = 404;
        return next(err);
      }
      res.render('brand_model_detail', {
        title: req.params.brand + ' ' + req.params.model + 's',
        model: req.params.model,
        guitarList: guitars,
        seriesList: guitarSeries,
        brand: brand,
      });
    } catch (err) {
      console.log('error');
      return next(err);
    }
  };
  getInfo();
};

// Page for the series
exports.brand_model_series_detail = function (req, res, next) {
  const getInfo = async () => {
    try {
      const brand = await Brand.findOne({ name: req.params.brand });
      const guitarModel = await Guitar.findOne({
        model: req.params.model,
      });
      const guitarSeries = await Series.find({ series: req.params.series });
      const guitars = await Guitarinstance.find({ series: req.params.series });

      if (!brand | !guitarModel | !guitarSeries) {
        const err = new Error('Not found');
        err.status = 404;
        return next(err);
      }

      let lowestPrice = null;

      guitars.forEach((guitar) => {
        if (!lowestPrice) {
          lowestPrice = guitar.price;
        } else if (guitar.price < lowestPrice) {
          lowestPrice = guitar.price;
        }
      });

      res.render('brand_series_detail', {
        title: req.params.brand + ' ' + req.params.series,
        model: req.params.model,
        guitarList: guitars,
        seriesInfo: guitarSeries[0],
        lowPrice: lowestPrice,
        brand: brand,
        modelInfo: guitarModel,
      });
    } catch (err) {
      console.log('error');
      return next(err);
    }
  };
  getInfo();
};
