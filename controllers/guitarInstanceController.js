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
        console.log('same');
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

exports.guitar_update_get = (req, res, next) => {
  res.send('incomplete');
};

exports.guitar_update_post = (req, res, next) => {
  res.send('incomplete');
};

exports.guitar_delete_get = (req, res, next) => {
  res.send('incomplete');
};

exports.guitar_delete_post = (req, res, next) => {
  res.send('incomplete');
};

exports.guitar_list = (req, res, next) => {
  res.send('incomplete');
};
