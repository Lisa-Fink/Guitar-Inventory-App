const Brand = require('../models/brand');
const Guitar = require('../models/guitar');
const GuitarInstance = require('../models/guitarInstance');
const Series = require('../models/series');

const { body, validationResult } = require('express-validator');

exports.guitar_create_get = async (req, res, next) => {
  const brandList = await Brand.find({}, { name: 1 });
  const modelList = await Guitar.find({}, { _id: 0, model: 1, brand: 1 });
  const seriesList = await Series.find(
    {},
    { _id: 0, model: 1, brand: 1, series: 1, colors: 1 }
  );

  // lookup the colors in the series
  const colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'white',
    'black',
    'sunburst',
  ];

  // created copy because the original isn't passing in colors
  copiedSeries = [];

  seriesList.forEach((series) => {
    copy = {
      brand: series.brand,
      series: series.series,
      model: series.model,
      colors: series.colors,
    };
    copiedSeries.push(copy);
  });

  res.render('guitar_instance_form', {
    title: 'Add a Guitar',
    // status true is updating not creating
    status: false,
    defaultModel: req.query.model,
    defaultBrand: req.query.brand,
    defaultSeries: req.query.series,
    brands: brandList,
    models: modelList,
    series: copiedSeries,
    colors: colors,
  });
};

exports.guitar_create_post = [
  body('price').escape(),
  body('serialNum').trim().escape(),
  async (req, res, next) => {
    seriesInfo = JSON.parse(req.body.series);

    // check if guitar exists
    GuitarInstance.findOne({
      series: seriesInfo.series,
      serialNum: req.body.serialNum,
    }).exec((err, sameGuitar) => {
      if (err) {
        return next(err);
      }
      if (sameGuitar) {
        // the guitar already exists so redirect to the page
        res.redirect(
          `../brands/${seriesInfo.bName}/${seriesInfo.model}/${seriesInfo.series}/${req.body.serialNum}`
        );
      } else {
        const newGuitarInstance = new GuitarInstance({
          brand: seriesInfo.brand,
          model: seriesInfo.model,
          series: seriesInfo.series,
          color: req.body.color,
          price: req.body.price,
          serialNum: req.body.serialNum,
        });

        newGuitarInstance.save((err) => {
          if (err) {
            return next(err);
          }
          console.log('new guitar saved');
          // redirect to the new page
          res.redirect(
            `../brands/${seriesInfo.bName}/${seriesInfo.model}/${seriesInfo.series}/${req.body.serialNum}`
          );
        });
      }
    });
  },
];

exports.guitar_update_get = async (req, res, next) => {
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

  const guitar = await GuitarInstance.findById(req.params.id);

  if (!guitar) {
    const err = new Error('Not found');
    err.status = 404;
    return next(err);
  }

  const brandList = await Brand.find({}, { name: 1 });
  const modelList = await Guitar.find({}, { _id: 0, model: 1, brand: 1 });
  const seriesList = await Series.find(
    {},
    { _id: 0, model: 1, brand: 1, series: 1, colors: 1 }
  );

  const brandName = await Brand.findById(guitar.brand);

  // lookup the colors in the series
  const colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'white',
    'black',
    'sunburst',
  ];

  // created copy because the original isn't passing in colors
  copiedSeries = [];

  seriesList.forEach((series) => {
    copy = {
      brand: series.brand,
      series: series.series,
      model: series.model,
      colors: series.colors,
    };
    copiedSeries.push(copy);
  });

  // adding brand name to the original guitar
  const originalGuitar = { brandName: brandName.name, ...guitar._doc };

  res.render('guitar_instance_form', {
    title: 'Edit Guitar',
    // status true is updating not creating
    status: true,
    defaultModel: guitar.model,
    defaultBrand: guitar.brand,
    defaultSeries: guitar.series,
    brands: brandList,
    models: modelList,
    series: copiedSeries,
    colors: colors,
    price: guitar.price,
    serialNum: guitar.serialNum,
    defaultColor: guitar.color,
    brandName: brandName.name,
    originalGuitar: originalGuitar,
  });
};

exports.guitar_update_post = [
  body('price').escape(),
  body('serialNum').trim().escape(),
  async (req, res, next) => {
    const originalGuitar = JSON.parse(req.body.guitar);
    const formSeries = JSON.parse(req.body.series);

    // check if changed
    if (
      originalGuitar.color == req.body.color &&
      originalGuitar.price == req.body.price &&
      originalGuitar.serialNum == req.body.serialNum &&
      originalGuitar.series == formSeries.series &&
      originalGuitar.model == formSeries.model &&
      originalGuitar.brand == formSeries.brand
    ) {
      res.redirect(
        `../../brands/${originalGuitar.brandName}/${originalGuitar.model}/${originalGuitar.series}/${originalGuitar.serialNum}`
      );
      return;
    }

    let update = {};

    // if serial number/ series changed, verify that it is a unique serial num to the series
    if (
      (originalGuitar.serialNum != req.body.serialNum) |
      (originalGuitar.series != formSeries.series)
    ) {
      const existing = await GuitarInstance.findOne({
        serialNum: req.body.serialNum,
        series: formSeries.series,
      });
      if (existing) {
        res.redirect(
          `../../brands/${formSeries.bName}/${formSeries.model}/${formSeries.series}/${req.body.serialNum}`
        );
        return;
      }
      if (originalGuitar.serialNum != req.body.serialNum) {
        update.serialNum = req.body.serialNum;
      }
      if (originalGuitar.series != formSeries.series) {
        update.series = formSeries.series;
      }
    }
    // update the remaining changes made
    if (originalGuitar.color != req.body.color) {
      update.color = req.body.color;
    }
    if (originalGuitar.price != req.body.price) {
      update.price = req.body.price;
    }
    if (originalGuitar.brand != formSeries.brand) {
      update.brand = formSeries.brand;
    }
    if (originalGuitar.model != formSeries.model) {
      update.model = formSeries.model;
    }

    const updateDocument = {
      $set: update,
    };

    // save the updated guitar
    GuitarInstance.updateOne({ _id: originalGuitar._id }, updateDocument).exec(
      (err) => {
        if (err) {
          return next(err);
        }
        // redirect to the updated page
        console.log('guitar updated');
        res.redirect(
          `../../brands/${formSeries.bName}/${formSeries.model}/${formSeries.series}/${req.body.serialNum}`
        );
      }
    );
  },
];

exports.guitar_delete_get = async (req, res, next) => {
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

  const guitarInstance = await GuitarInstance.findById(req.params.id);
  if (!guitarInstance) {
    const err = new Error('Guitar not found');
    err.status = 404;
    return next(err);
  }
  const brand = await Brand.findById(guitarInstance.brand, { name: 1 });

  res.render('guitar_instance_delete', {
    brand: brand.name,
    model: guitarInstance.model,
    id: req.params.id,
    series: guitarInstance.series,
    title: `Delete ${brand.name} - ${guitarInstance.model} - ${guitarInstance.series} - Serial Number: ${guitarInstance.serialNum} Guitar`,
  });
};

exports.guitar_delete_post = async (req, res, next) => {
  const guitarInstanceID = req.body.guitarInstanceID;

  // validate the id from the url
  const ObjectId = require('mongoose').Types.ObjectId;
  function isValidObjectId(id) {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) return true;
      return false;
    }
    return false;
  }
  if (!isValidObjectId(req.params.id) | (req.params.id !== guitarInstanceID)) {
    const err = new Error('Guitar not found');
    err.status = 404;
    return next(err);
  }

  GuitarInstance.findByIdAndRemove(guitarInstanceID, (err) => {
    if (err) {
      return next(err);
    }
    // success go to guitar list
    res.redirect('../');
  });
};

exports.guitar_list = async (req, res, next) => {
  const brandList = await Brand.find({}, { name: 1 });
  const modelList = await Guitar.find({}, { _id: 0, model: 1, brand: 1 });
  const seriesList = await Series.find(
    {},
    { _id: 0, model: 1, brand: 1, series: 1 }
  );
  const guitarList = await GuitarInstance.find({});

  res.render('guitar_instance_list', {
    brandList: brandList,
    modelList: modelList,
    seriesList: seriesList,
    guitarList: guitarList,
    title: 'Guitars',
  });
};
