const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true, maxLength: 100 },
  about: { type: String },
});

BrandSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/brands/${this.name}`;
});

module.exports = mongoose.model('Brand', BrandSchema);
