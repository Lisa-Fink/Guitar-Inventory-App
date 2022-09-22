const Brand = require('../models/brand');
const Guitar = require('../models/guitar');
const Guitarinstance = require('../models/guitarinstance');
const Series = require('../models/series');

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
  const brandInfo = await Brand.findOne({ name: req.params.name });
  if (brandInfo == null) {
    // No results.
    const err = new Error('Brand not found');
    err.status = 404;
    return next(err);
  }

  const guitarInfo = await Guitar.find({ brand: brandInfo._id });

  const allGuitars = await Guitarinstance.find({ brand: brandInfo._id });

  // Successful
  res.render('brand_detail', {
    title: req.params.name + ' Guitars',
    brand: req.params.name,
    guitarModels: guitarInfo,
    guitarInstance: allGuitars,
  });
};

// Display list of all series/guitars of the model
exports.brand_model_detail = function (req, res, next) {
  const getInfo = async () => {
    try {
      const brand = await Brand.findOne({ name: req.params.brand });
      const guitarModel = await Guitar.findOne({
        model: req.params.model,
      });
      const guitarSeries = await Series.find({ model: req.params.model });
      const guitars = await Guitarinstance.find({ model: req.params.model });

      if (!brand | !guitarModel) {
        const err = new Error('Not found');
        err.status = 404;
        return next(err);
      }
      res.render('brand_model_detail', {
        title: req.params.brand + ' ' + req.params.model + 's',
        model: guitarModel.model,
        modelID: guitarModel._id,
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
exports.brand_model_series_detail = async function (req, res, next) {
  const brand = await Brand.findOne({ name: req.params.brand });
  const guitarModel = await Guitar.findOne({
    model: req.params.model,
  });
  const guitarSeries = await Series.findOne({ series: req.params.series });
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
    seriesInfo: guitarSeries,
    lowPrice: lowestPrice,
    brand: brand,
    modelInfo: guitarModel,
  });
};

// Page for the guitar instance
exports.brand_model_series_instance_detail = async function (req, res, next) {
  const brand = await Brand.findOne({ name: req.params.brand });
  const guitarModel = await Guitar.findOne({
    model: req.params.model,
  });
  const guitarSeries = await Series.findOne({ series: req.params.series });
  const guitar = await Guitarinstance.findOne({
    serialNum: req.params.serial,
  });

  const guitars = await Guitarinstance.find({ series: req.params.series });

  if (!brand | !guitarModel | !guitarSeries | !guitar) {
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

  res.render('brand_series_instance_detail', {
    title: req.params.brand + ' ' + req.params.series,
    model: req.params.model,
    guitar: guitar,
    seriesInfo: guitarSeries,
    brand: brand,
    modelInfo: guitarModel,
    lowPrice: lowestPrice,
  });
};

// Page for creating a new brand
exports.brand_create_get = function (req, res, next) {
  res.render('brand_form', { title: 'Add a Brand' });
};

// Handle create Brand on POST
exports.brand_create_post = [
  // Sanitize and validate the name field
  body('name', 'Brand name required').trim().isLength({ min: 1 }).escape(),
  body('about').escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const brand = new Brand({
      name: req.body.name,
      about: req.body.about,
    });

    if (!errors.isEmpty()) {
      // Handle Errors
      res.render('brand_form', {
        title: 'Add a Brand',
        errors: errors.array(),
      });
      return;
    } else {
      // Check if the brand already exists
      Brand.findOne({ name: req.body.name }).exec((err, found_brand) => {
        if (err) {
          return next(err);
        }

        if (found_brand) {
          // Redirect to the brand page
          res.redirect(found_brand.url);
        } else {
          brand.save((err) => {
            if (err) {
              return next(err);
            }
            // Brand save, redirect to new brand page
            console.log('saved');
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];

// Display Brand update form on GET
exports.brand_update_get = (req, res, next) => {
  // get brand
  Brand.findOne({ name: req.params.name }).exec((err, found_brand) => {
    if (err) {
      return next(err);
    }
    if (found_brand == null) {
      const err = new Error('Brand not found');
      err.status = 404;
      return next(err);
    }
    res.render('brand_form', {
      title: 'Brand Form',
      brand: found_brand.name,
      about: found_brand.about,
      status: 'update',
    });
  });
};

// Handle update brand POST
exports.brand_update_post = [
  body('name', 'Brand name required').trim().isLength({ min: 1 }).escape(),
  body('about').escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Handle Errors
      return next(err);
    } else {
      // Check if the about has changed
      Brand.findOne({ name: req.params.name }).exec((err, found_brand) => {
        if (err) {
          return next(err);
        }
        if (
          req.body.about == found_brand.about &&
          req.body.name == found_brand.name
        ) {
          // Redirect to the brand page
          res.redirect(found_brand.url);
        } else {
          const filter = { name: found_brand.name };
          let updateDocument = {
            $set: { name: req.body.name, about: req.body.about },
          };
          if (req.body.name == found_brand.name) {
            updateDocument = { $set: { about: req.body.about } };
          } else if (req.body.about == found_brand.about) {
            updateDocument = { $set: { name: req.body.name } };
          }
          Brand.updateOne(filter, updateDocument).exec((err) => {
            if (err) {
              return next(err);
            }
            console.log('updated');
            res.redirect('/brands/' + req.body.name);
          });
        }
      });
    }
  },
];

exports.brand_delete_get = async (req, res, next) => {
  const brand = await Brand.findOne({ name: req.params.name });
  if (brand == null) {
    const err = new Error('Brand not found');
    err.status = 404;
    return next(err);
  }
  const guitarInstance = await Guitarinstance.find({ brand: brand._id });
  const guitarModels = await Guitar.find({ brand: brand._id });
  const series = await Series.find({ brand: brand._id });

  if (!guitarInstance.length && !guitarModels.length && !series.length) {
    // can delete: go to delete page with button are you sure?
    res.render('brand_delete', {
      del: true,
      brand: req.params.name,
      id: brand._id,
      title: `Delete ${req.params.name} Brand`,
    });
  } else {
    // go to delete page with message unable to delete
    // must delete all guitar instances, models, and series before deleting brand
    res.render('brand_delete', {
      del: false,
      brand: req.params.name,
      instances: guitarInstance,
      guitarModels: guitarModels,
      series: series,
      title: `Delete ${req.params.name} Brand`,
    });
  }
};

exports.brand_delete_post = async (req, res, next) => {
  const id = req.body.brandid;
  const brand = await Brand.findById(id);
  if (brand == null) {
    const err = new Error('Brand not found');
    err.status = 404;
    return next(err);
  }
  const guitarInstance = await Guitarinstance.find({ brand: id });
  const guitarModels = await Guitar.find({ brand: id });
  const series = await Series.find({ brand: id });

  if (guitarInstance.length && guitarModels.length && !series.length) {
    // can't delete render the same form as get
    res.render('brand_delete', {
      del: false,
      brand: brand.name,
      id: id,
      instances: guitarInstance,
      guitarModels: guitarModels,
      series: series,
    });
    return;
  }
  Brand.findByIdAndRemove(id, (err) => {
    if (err) {
      return next(err);
    }
    // success - go to brand list
    res.redirect('../');
  });
};
