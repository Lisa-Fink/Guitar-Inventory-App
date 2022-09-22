const Brand = require('../models/brand');
const Guitar = require('../models/guitar');
const Guitarinstance = require('../models/guitarinstance');
const Series = require('../models/series');

const { body, validationResult } = require('express-validator');
const brand = require('../models/brand');

exports.series_list = (req, res, next) => {
  res.send('incomplete');
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
  ];

  res.render('series_form', {
    title: 'Add a guitar series',
    // status true is updating not creating
    status: false,
    defaultModel: req.query.model,
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

    for (let feature in req.body.features) {
      if (feature) {
        feature.push(feature);
      }
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
      ];

      for (let color of colorList) {
        if (
          req.body['colors'] &&
          req.body['colors'].filter((selectedColor) => selectedColor === color)
            .length
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
          `../brands/${brandName}/${sameBrandModelSeries.model}/${sameBrandModelSeries.name}`
        );
        return;
      }
    });

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
      res.redirect(`../brands/${brandName}/${model.model}/${req.body.name}`);
    });
  },
];

// exports.model_update_get = async (req, res, next) => {
//   const gModel = await Guitar.findOne({ model: req.params.model });
//   if (gModel == null) {
//     const err = new Error('Not found');
//     err.status = 404;
//     return next(err);
//   }

//   // find the brand
//   const brand = await Brand.findById(gModel.brand);

//   // find all brands for the select list
//   const brandList = await Brand.find({}, { name: 1 });

//   res.render('model_form', {
//     status: true,
//     brands: brandList,
//     defaultBrand: brand.name,
//     editModel: gModel.model,
//   });
// };

// exports.model_update_post = [
//   body('model', 'Model name required').trim().escape(),
//   async (req, res, next) => {
//     const originalModel = await Guitar.findOne({ model: req.params.model });
//     // create a new model
//     // default include type of 'Electric Guitar' (future update could include different types)
//     // default stock of 0
//     const errors = validationResult(req);
//     const brand = JSON.parse(req.body.brand);
//     // req.body.model = new model name
//     if (!errors.isEmpty()) {
//       // Handle Errors
//       res.render('model_form'),
//         {
//           errors: errors.array(),
//         };
//     }

//     // Check if original model or brand are the same
//     if (
//       originalModel.model == req.body.model &&
//       originalModel.brand == brand._id
//     ) {
//       // nothing changed
//       res.redirect(`../brands/${brand.name}/${originalModel.model}`);
//       return;
//     }

//     // update both model name and brand
//     let updateDocument = {
//       $set: { model: req.body.model, brand: brand._id },
//     };

//     // Check if model name is the same but brand changed
//     if (originalModel.model == req.body.model) {
//       // update brand
//       updateDocument = {
//         $set: { brand: brand._id },
//       };
//     }

//     // Check if brand is the same but model name changed
//     if (originalModel.brand == brand._id) {
//       // update model name
//       updateDocument = {
//         $set: { model: req.body.model },
//       };
//     }

//     // find and update all series and guitar instances of the model
//     Series.updateMany({ model: originalModel.model }, updateDocument).exec(
//       (err) => {
//         if (err) {
//           return next(err);
//         }
//       }
//     );

//     Guitarinstance.updateMany(
//       { model: originalModel.model },
//       updateDocument
//     ).exec((err) => {
//       if (err) {
//         return next(err);
//       }
//     });
//     // update the one model
//     Guitar.updateOne({ model: originalModel.model }, updateDocument).exec(
//       (err) => {
//         if (err) {
//           return next(err);
//         }
//         // redirect to the new page
//         console.log('model updated');
//         res.redirect(`../../brands/${brand.name}/${req.body.model}`);
//       }
//     );
//   },
// ];

// exports.model_delete_get = (req, res, next) => {
//   res.send('incomplete');
// };

// exports.model_delete_post = (req, res, next) => {
//   res.send('incomplete');
// };
