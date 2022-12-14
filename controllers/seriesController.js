const Brand = require('../models/brand');
const Guitar = require('../models/guitar');
const GuitarInstance = require('../models/guitarInstance');
const Series = require('../models/series');

const { body, validationResult } = require('express-validator');

exports.series_list = async (req, res, next) => {
  const brandList = await Brand.find({}, { name: 1 });
  const modelList = await Guitar.find({}, { _id: 0, model: 1, brand: 1 });
  const seriesList = await Series.find(
    {},
    { _id: 0, model: 1, brand: 1, series: 1 }
  );

  res.render('series_list', {
    brandList: brandList,
    modelList: modelList,
    seriesList: seriesList,
    title: 'Series',
  });
};

exports.series_create_get = async (req, res, next) => {
  const brandList = await Brand.find({}, { name: 1 });
  const modelList = await Guitar.find({}, { _id: 0, model: 1, brand: 1 });

  const colors = [
    { name: 'red', checked: false },
    { name: 'orange', checked: false },
    { name: 'yellow', checked: false },
    { name: 'green', checked: false },
    { name: 'blue', checked: false },
    { name: 'purple', checked: false },
    { name: 'white', checked: false },
    { name: 'black', checked: false },
    { name: 'sunburst', checked: false },
    { name: 'silver', checked: false },
  ];

  res.render('series_form', {
    title: 'Add a guitar series',
    // status true is updating not creating
    status: false,
    defaultModel: req.query.model,
    defaultBrand: req.query.brand,
    brands: brandList,
    models: modelList,
    colors: colors,
  });
};

exports.series_create_post = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('about').trim().escape(),
  body('features0').trim().escape(),
  body('features1').trim().escape(),
  body('features2').trim().escape(),
  body('features3').trim().escape(),
  body('features4').trim().escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    const model = JSON.parse(req.body.model);
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const features = [];

    if (req.body.features0) {
      features.push(req.body.features0);
    }
    if (req.body.features1) {
      features.push(req.body.features1);
    }
    if (req.body.features2) {
      features.push(req.body.features2);
    }
    if (req.body.features3) {
      features.push(req.body.features3);
    }
    if (req.body.features4) {
      features.push(req.body.features4);
    }

    if (!errors.isEmpty()) {
      // there are errors get info needed to render form again and render
      const brandList = await Brand.find({}, { name: 1 });
      const modelList = await Guitar.find({}, { _id: 0, model: 1, brand: 1 });

      const colorList = [
        { name: 'red', checked: false },
        { name: 'orange', checked: false },
        { name: 'yellow', checked: false },
        { name: 'green', checked: false },
        { name: 'blue', checked: false },
        { name: 'purple', checked: false },
        { name: 'white', checked: false },
        { name: 'black', checked: false },
        { name: 'sunburst', checked: false },
        { name: 'silver', checked: false },
      ];

      for (let color of colorList) {
        if (
          req.body['colors[]'] &&
          req.body['colors[]'].filter(
            (selectedColor) => selectedColor === color
          ).length
        ) {
          color.checked = true;
        }
      }

      res.render('series_form', {
        title: 'Add a guitar series',
        // status true is updating not creating
        status: false,
        defaultModel: model.name,
        brands: brandList,
        models: modelList,
        colors: colorList,
        seriesName: req.body.name,
        features: features,
        errors: errors.array(),
      });
      return;
    }
    // create and save the new series
    const brandName = model.bName;

    // check if the series already exists:
    Series.findOne({
      brand: model.brand,
      model: model.model,
      series: req.body.name,
    }).exec((err, sameBrandModelSeries) => {
      if (err) {
        return next(err);
      }
      if (sameBrandModelSeries) {
        // the series already exists so redirect to the page
        res.redirect(
          `../brands/${brandName}/${sameBrandModelSeries.model}/${sameBrandModelSeries.series}`
        );
      } else {
        const newSeries = new Series({
          brand: model.brand,
          model: model.model,
          series: req.body.name,
          stock: 0,
          strings: 6,
          colors: req.body['colors[]'],
          features: features,
        });

        newSeries.save((err) => {
          if (err) {
            return next(err);
          }
          console.log('saved');
          // redirect to the new page
          res.redirect(
            `../brands/${brandName}/${model.model}/${req.body.name}`
          );
        });
      }
    });
  },
];

exports.series_update_get = async (req, res, next) => {
  const brandList = await Brand.find({}, { name: 1 });
  const modelList = await Guitar.find({}, { _id: 0, model: 1, brand: 1 });

  // validate the id from the url
  const ObjectId = require('mongoose').Types.ObjectId;
  function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  }
  if (!isValidObjectId(req.params.id)) {
    const err = new Error('Not found');
    err.status = 404;
    return next(err);
  }

  const series = await Series.findOne({
    _id: req.params.id,
    series: req.params.series,
  });
  console.log('series', series);
  if (series === null) {
    const err = new Error('Not found');
    err.status = 404;
    return next(err);
  }

  seriesBrandName = brandList.filter(
    (brand) => brand._id.toString() == series.brand.toString()
  )[0].name;

  const colors = [
    { name: 'red', checked: false },
    { name: 'orange', checked: false },
    { name: 'yellow', checked: false },
    { name: 'green', checked: false },
    { name: 'blue', checked: false },
    { name: 'purple', checked: false },
    { name: 'white', checked: false },
    { name: 'black', checked: false },
    { name: 'sunburst', checked: false },
    { name: 'silver', checked: false },
  ];

  for (let seriesColor of series.colors) {
    for (let color of colors) {
      if (seriesColor == color.name) {
        color.checked = true;
      }
    }
  }

  console.log(series.model, series.brand);

  res.render('series_form', {
    title: `Edit ${series.series} Series`,
    // status true is updating not creating
    status: true,
    defaultModel: series.model,
    defaultBrand: series.brand,
    brands: brandList,
    models: modelList,
    colors: colors,
    about: series.description,
    features: series.features,
    seriesName: series.series,
    brandName: seriesBrandName,
  });
};

exports.series_update_post = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('about').trim().escape(),
  body('features0').trim().escape(),
  body('features1').trim().escape(),
  body('features2').trim().escape(),
  body('features3').trim().escape(),
  body('features4').trim().escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const features = [];
    const model = JSON.parse(req.body.model);

    if (req.body.features0) {
      features.push(req.body.features0);
    }
    if (req.body.features1) {
      features.push(req.body.features1);
    }
    if (req.body.features2) {
      features.push(req.body.features2);
    }
    if (req.body.features3) {
      features.push(req.body.features3);
    }
    if (req.body.features4) {
      features.push(req.body.features4);
    }

    if (!errors.isEmpty()) {
      // there are errors get info needed to render form again and render
      const brandList = await Brand.find({}, { name: 1 });
      const modelList = await Guitar.find({}, { _id: 0, model: 1, brand: 1 });

      const colorList = [
        { name: 'red', checked: false },
        { name: 'orange', checked: false },
        { name: 'yellow', checked: false },
        { name: 'green', checked: false },
        { name: 'blue', checked: false },
        { name: 'purple', checked: false },
        { name: 'white', checked: false },
        { name: 'black', checked: false },
        { name: 'sunburst', checked: false },
        { name: 'silver', checked: false },
      ];

      for (let color of colorList) {
        if (
          req.body['colors[]'] &&
          req.body['colors[]'].filter(
            (selectedColor) => selectedColor === color
          ).length
        ) {
          color.checked = true;
        }
      }

      res.render('series_form', {
        title: `Edit ${req.body.name} Series`,
        // status true is updating not creating
        status: true,
        defaultModel: req.body.model.model,
        brands: brandList,
        models: modelList,
        colors: colors,
        about: req.body.about,
        features: req.body.features,
        seriesName: req.body.name,
        brandName: req.body.model.bName,
      });
      return;
    }
    // check if original series has any differences
    const originalSeries = await Series.findById(req.params.id);

    const checkSameArr = (arr1, arr2) => {
      if (arr1 && arr2 && arr1.length === arr2.length) {
        for (const item of arr1) {
          if (arr2.includes(item) == false) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    };

    for (const item in originalSeries) {
      if (
        originalSeries.model === model.model &&
        originalSeries.brand.toString() === model.brand &&
        originalSeries.series === req.body.name &&
        originalSeries.description === req.body.about &&
        checkSameArr(originalSeries.colors, req.body['colors[]']) &&
        checkSameArr(originalSeries.features, features)
      ) {
        // no changes were made, redirect to the page
        res.redirect(
          `../../../brands/${model.bName}/${model.model}/${req.body.name}`
        );
        return;
      }
    }

    let update = {};

    // check which keys need to be updated and add to update
    if (originalSeries.series != req.body.name) {
      // if series name changed check if there's a model with the same brand and series name
      const checkSameNameModelBrand = await Series.findOne({
        series: req.body.name,
        model: model.model,
        brand: model.brand,
      });
      if (checkSameNameModelBrand) {
        // the series already exists so redirect to page
        res.redirect(
          `../../../brands/${model.bName}/${model.model}/${req.body.name}`
        );
        return;
      }
      update.series = req.body.name;
    }

    if (originalSeries.model !== model.model) {
      update.model = model.model;
    }

    if (originalSeries.brand !== model.brand) {
      update.brand = model.brand;
    }

    if (originalSeries.description !== req.body.about) {
      update.description = req.body.about;
    }

    if (!checkSameArr(originalSeries.colors, req.body['colors[]'])) {
      update.colors = req.body['colors[]'];
    }

    if (!checkSameArr(originalSeries.features, features)) {
      update.features = features;
    }

    let updateDocument = {
      $set: update,
    };

    // save the updated series
    Series.updateOne({ _id: originalSeries._id }, updateDocument).exec(
      (err) => {
        if (err) {
          return next(err);
        }
        // redirect to the updated page
        console.log('series updated');
        res.redirect(
          `../../../brands/${model.bName}/${model.model}/${req.body.name}`
        );
      }
    );
  },
];

exports.series_delete_get = async (req, res, next) => {
  // validate the id from the url
  const ObjectId = require('mongoose').Types.ObjectId;
  function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  }
  if (!isValidObjectId(req.params.id)) {
    const err = new Error('Series not found');
    err.status = 404;
    return next(err);
  }

  const series = await Series.findById(req.params.id);
  if (!series | (series.series !== req.params.series)) {
    const err = new Error('Series not found');
    err.status = 404;
    return next(err);
  }
  const brand = await Brand.findById(series.brand, { name: 1 });

  const guitarInstance = await GuitarInstance.find({
    brand: series.brand,
    model: series.model,
    series: series.series,
  });
  if (!guitarInstance.length) {
    // can delete: go to delete page with confirm button
    res.render('series_delete', {
      del: true,
      brand: brand.name,
      model: series.model,
      id: series._id,
      series: series.series,
      title: `Delete ${brand.name} - ${series.model} - ${series.series} Series`,
    });
  } else {
    // unable to delete, need to first delete all guitar instances with the series
    res.render('series_delete', {
      del: false,
      brand: brand.name,
      model: series.model,
      id: series._id,
      instances: guitarInstance,
      series: series.series,
      title: `Delete ${brand.name} - ${series.model} - ${series.series} Series`,
    });
  }
};

exports.series_delete_post = async (req, res, next) => {
  const seriesID = req.body.seriesID;

  // check if delete is valid

  // validate the id from the url
  const ObjectId = require('mongoose').Types.ObjectId;
  function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  }
  if (!isValidObjectId(req.params.id)) {
    const err = new Error('Series not found');
    err.status = 404;
    return next(err);
  }

  const series = await Series.findById(req.params.id);
  if (
    !series |
    ((series.series !== req.params.series) | (seriesID !== req.params.id))
  ) {
    const err = new Error('Series not found');
    err.status = 404;
    return next(err);
  }

  const brand = await Brand.findById(series.brand, { name: 1 });
  const guitarInstance = await GuitarInstance.find({
    brand: series.brand,
    model: series.model,
    series: series.series,
  });

  if (guitarInstance.length) {
    // unable to delete, need to first delete guitar instance and/or series or the model
    res.render('series_delete', {
      del: true,
      brand: brand.name,
      model: series.model,
      id: series._id,
      series: series.series,
      title: `Delete ${brand.name} - ${series.model} - ${series.series} Series`,
    });
  }
  // can delete
  Series.findByIdAndRemove(seriesID, (err) => {
    if (err) {
      return next(err);
    }
    // success go to series list
    res.redirect('../../');
  });
};
