const Brand = require('../models/brand');
const Guitar = require('../models/guitar');
const GuitarInstance = require('../models/guitarInstance');
const Series = require('../models/series');

const { body, validationResult } = require('express-validator');

exports.model_list = async (req, res, next) => {
  const brandList = await Brand.find({}, { name: 1 });
  const modelList = await Guitar.find({}, { model: 1, _id: 0, brand: 1 });

  res.render('model_list', {
    brandList: brandList,
    modelList: modelList,
    title: 'Models',
  });
};

exports.model_create_get = async (req, res, next) => {
  const brandList = await Brand.find({}, { name: 1 });
  res.render('model_form', {
    // status true is updating not creating
    status: false,
    defaultBrand: req.query.brand,
    brands: brandList,
    title: 'Add a Model',
  });
};

exports.model_create_post = [
  body('model', 'Model name required').trim().escape(),
  body('description').trim().escape(),
  async (req, res, next) => {
    // create a new model
    // default include type of 'Electric Guitar' (future update could include different types)
    // default stock of 0
    const errors = validationResult(req);
    const brand = JSON.parse(req.body.brand);
    // req.body.model = new model name
    if (!errors.isEmpty()) {
      // Handle Errors
      res.render('model_form'),
        {
          errors: errors.array(),
        };
    }

    // Check if the model already exists:
    // // find any model with the brand id and model name
    Guitar.findOne({ brand: brand._id, model: req.body.model }).exec(
      (err, sameModelNameBrand) => {
        if (err) {
          return next(err);
        }
        if (sameModelNameBrand) {
          // the model already exists so redirect to the page
          res.redirect(`../brands/${brand.name}/${sameModelNameBrand.model}`);
        } else {
          const gModel = new Guitar({
            brand: brand._id,
            model: req.body.model,
            description: req.body.description,
            stock: 0,
            type: 'Electric Guitar',
          });

          gModel.save((err) => {
            if (err) {
              return next(err);
            }
          });
          // redirect to the new page
          console.log('model saved');
          res.redirect(`../brands/${brand.name}/${req.body.model}`);
        }
      }
    );
  },
];

exports.model_update_get = async (req, res, next) => {
  const gModel = await Guitar.findOne({
    model: req.params.model,
    _id: req.params.id,
  });
  if (gModel == null) {
    const err = new Error('Not found');
    err.status = 404;
    return next(err);
  }

  // find the brand
  const brand = await Brand.findById(gModel.brand);

  // find all brands for the select list
  const brandList = await Brand.find({}, { name: 1 });

  res.render('model_form', {
    status: true,
    brands: brandList,
    defaultBrand: brand.name,
    editModel: gModel.model,
    editDescription: gModel.description,
  });
};

exports.model_update_post = [
  body('model', 'Model name required').trim().escape(),
  body('description').trim().escape(),
  async (req, res, next) => {
    const originalModel = await Guitar.findOne({
      model: req.params.model,
      _id: req.params.id,
    });
    const errors = validationResult(req);
    const brand = JSON.parse(req.body.brand);
    // req.body.model = new model name
    if (!errors.isEmpty()) {
      // Handle Errors
      res.render('model_form'),
        {
          errors: errors.array(),
        };
    }

    // Check if anything changed
    if (
      originalModel.model == req.body.model &&
      originalModel.brand == brand._id &&
      originalModel.description == req.body.description
    ) {
      // nothing changed
      res.redirect(`../../../brands/${brand.name}/${originalModel.model}`);
      return;
    }
    // update model name, brand, and description
    let updates = {};
    let otherChanges = {};
    // Check if brand and model already exists
    if (
      (originalModel.model != req.body.model) |
      (originalModel.brand != brand._id)
    ) {
      const sameModelBrand = await Guitar.findOne({
        brand: brand._id,
        model: req.body.model,
      });
      if (sameModelBrand) {
        res.redirect(`../../../brands/${brand.name}/${req.body.model}`);
        return;
      }
      // Check if model name needs to update
      if (originalModel.model != req.body.model) {
        updates.model = req.body.model;
        otherChanges.model = req.body.model;
      }
      // Check if brand needs to update
      if (originalModel.brand != brand._id) {
        updates.brand = brand._id;
        otherChanges.brand = brand._id;
      }
      changedModel = {
        $set: otherChanges,
      };
      // update all series and guitars of the model with the new model name
      // and/or new brand
      Series.updateMany(
        { model: originalModel.model, brand: originalModel.brand },
        changedModel
      ).exec((err) => {
        if (err) {
          return next(err);
        }
      });
      GuitarInstance.updateMany(
        { model: originalModel.model, brand: originalModel.brand },
        changedModel
      ).exec((err) => {
        if (err) {
          return next(err);
        }
      });
    }

    // Check if description needs to update
    if (originalModel.description != req.body.description) {
      updates.description = req.body.description;
    }
    let updateDocument = {
      $set: updates,
    };
    // update the one model
    Guitar.updateOne(
      { model: originalModel.model, brand: originalModel.brand },
      updateDocument
    ).exec((err) => {
      if (err) {
        return next(err);
      }
      // redirect to the new page
      console.log('model updated');
      res.redirect(`../../../brands/${brand.name}/${req.body.model}`);
    });
  },
];

exports.model_delete_get = async (req, res, next) => {
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

  const model = await Guitar.findById(req.params.id);
  if (!model | (model.model !== req.params.model)) {
    const err = new Error('Model not found');
    err.status = 404;
    return next(err);
  }

  const brand = await Brand.findById(model.brand, { name: 1 });
  const series = await Series.find({ brand: brand._id, model: model.model });
  const guitarInstance = await GuitarInstance.find({
    brand: brand._id,
    model: model.model,
  });

  if (!series.length && !guitarInstance.length) {
    // can delete: go to delete page with confirm button
    res.render('model_delete', {
      del: true,
      brand: brand.name,
      model: model.model,
      id: model._id,
      title: `Delete ${brand.name} - ${model.model} Model`,
    });
  } else {
    // unable to delete, need to first delete guitar instance and/or series or the model
    res.render('model_delete', {
      del: false,
      brand: brand.name,
      instances: guitarInstance,
      series: series,
      title: `Delete ${brand.name} - ${model.model} Model`,
    });
  }
};

exports.model_delete_post = async (req, res, next) => {
  const modelID = req.body.modelID;

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
    const err = new Error('Not found');
    err.status = 404;
    return next(err);
  }

  const model = await Guitar.findById(req.params.id);
  if (
    !model |
    ((model.model !== req.params.model) | (modelID !== req.params.id))
  ) {
    const err = new Error('Model not found');
    err.status = 404;
    return next(err);
  }

  const brand = await Brand.findById(model.brand, { name: 1 });
  const series = await Series.find({ brand: model.brand, model: model.model });
  const guitarInstance = await GuitarInstance.find({
    brand: model.brand,
    model: model.model,
  });

  if (series.length | guitarInstance.length) {
    // unable to delete, need to first delete guitar instance and/or series or the model
    res.render('model_delete', {
      del: false,
      brand: brand.name,
      instances: guitarInstance,
      series: series,
      title: `Delete ${brand.name} - ${model.model} Model`,
    });
  }
  // can delete
  Guitar.findByIdAndRemove(modelID, (err) => {
    if (err) {
      return next(err);
    }
    // success go to model list
    res.redirect('../../');
  });
};
